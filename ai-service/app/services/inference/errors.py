class InferenceInputError(Exception):
    def __init__(self, detail: str, error_type: str, status_code: int = 400) -> None:
        super().__init__(detail)
        self.detail = detail
        self.error_type = error_type
        self.status_code = status_code
