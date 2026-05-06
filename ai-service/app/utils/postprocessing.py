def build_recommendations(finding: str, confidence: float) -> list[str]:
    if finding == "sin_hallazgo_relevante":
        return [
            "Mantener seguimiento clinico rutinario",
            "Correlacionar con examen intraoral",
        ]
    if confidence >= 0.8:
        return [
            "Priorizar evaluacion clinica en consulta actual",
            "Considerar imagen complementaria de confirmacion",
        ]
    return [
        "Revisar hallazgo con antecedentes del paciente",
        "Programar control para verificacion evolutiva",
    ]
