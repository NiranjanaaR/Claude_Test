package no.visible.scrollreminder.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

// One process-wide DataStore instance, created lazily off the Context extension.
private val Context.dataStore by preferencesDataStore(name = "settings")

/** Reads/writes [AppSettings] backed by Preferences DataStore. */
class SettingsRepository(private val context: Context) {

    private object Keys {
        val WATCHED = stringSetPreferencesKey("watched_packages")
        val THRESHOLD = intPreferencesKey("threshold_minutes")
        val BREAK_RESET = intPreferencesKey("break_reset_seconds")
        val COOLDOWN = intPreferencesKey("cooldown_minutes")
        val ENABLED = booleanPreferencesKey("enabled")
    }

    val settings: Flow<AppSettings> = context.dataStore.data.map { prefs ->
        val defaults = AppSettings()
        AppSettings(
            watchedPackages = prefs[Keys.WATCHED] ?: defaults.watchedPackages,
            thresholdMinutes = prefs[Keys.THRESHOLD] ?: defaults.thresholdMinutes,
            breakResetSeconds = prefs[Keys.BREAK_RESET] ?: defaults.breakResetSeconds,
            cooldownMinutes = prefs[Keys.COOLDOWN] ?: defaults.cooldownMinutes,
            enabled = prefs[Keys.ENABLED] ?: defaults.enabled,
        )
    }

    suspend fun setWatchedPackages(packages: Set<String>) =
        context.dataStore.edit { it[Keys.WATCHED] = packages }

    suspend fun setThresholdMinutes(value: Int) =
        context.dataStore.edit { it[Keys.THRESHOLD] = value.coerceIn(1, 240) }

    suspend fun setBreakResetSeconds(value: Int) =
        context.dataStore.edit { it[Keys.BREAK_RESET] = value.coerceIn(5, 600) }

    suspend fun setCooldownMinutes(value: Int) =
        context.dataStore.edit { it[Keys.COOLDOWN] = value.coerceIn(0, 120) }

    suspend fun setEnabled(value: Boolean) =
        context.dataStore.edit { it[Keys.ENABLED] = value }

    companion object {
        @Volatile
        private var instance: SettingsRepository? = null

        fun from(context: Context): SettingsRepository =
            instance ?: synchronized(this) {
                instance ?: SettingsRepository(context.applicationContext).also { instance = it }
            }
    }
}
