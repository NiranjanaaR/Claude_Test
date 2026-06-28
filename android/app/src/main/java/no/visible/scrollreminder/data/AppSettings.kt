package no.visible.scrollreminder.data

/** Immutable snapshot of all user-tunable settings. Persisted via DataStore. */
data class AppSettings(
    val watchedPackages: Set<String> = emptySet(),
    val thresholdMinutes: Int = 10,
    val breakResetSeconds: Int = 60,
    val cooldownMinutes: Int = 5,
    val enabled: Boolean = true,
)
