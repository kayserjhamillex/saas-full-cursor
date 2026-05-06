import { merge, Observable, of, Subject } from 'rxjs';
import { exhaustMap, finalize, map, tap } from 'rxjs/operators';

type BusyVm = { busy: boolean };

/**
 * A partir de un Subject de acción, expone un observable de `{ busy }` adecuado para el `AsyncPipe`
 * (una sola suscripción desde la plantilla, sin `subscribe` manual, sin leaks si el Subject se completa al destruir).
 * Usa `exhaustMap` para no encolar envíos mientras haya un trabajo en curso.
 */
export function toBusyViewModel$<T>(
  action$: Subject<void>,
  work: () => Observable<T>,
  onBeforeRun: () => void,
  onResult: (value: T) => void,
  onBusyChange?: (busy: boolean) => void,
): Observable<BusyVm> {
  return merge(
    of<BusyVm>({ busy: false }),
    action$.pipe(
      tap({
        next: () => {
          onBeforeRun();
          onBusyChange?.(true);
        },
      }),
      exhaustMap(() =>
        merge(
          of<BusyVm>({ busy: true }),
          work().pipe(
            tap({ next: onResult }),
            map((): BusyVm => ({ busy: false })),
            finalize(() => onBusyChange?.(false)),
          ),
        ),
      ),
    ),
  );
}
