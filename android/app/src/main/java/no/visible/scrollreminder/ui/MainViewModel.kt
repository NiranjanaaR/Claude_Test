package no.visible.scrollreminder.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import no.visible.scrollreminder.data.AppSettings
import no.visible.scrollreminder.data.SettingsRepository
import no.visible.scrollreminder.data.TodoItem
import no.visible.scrollreminder.data.TodoRepository
import no.visible.scrollreminder.util.InstalledApp
import no.visible.scrollreminder.util.InstalledApps

class MainViewModel(app: Application) : AndroidViewModel(app) {

    private val settingsRepo = SettingsRepository.from(app)
    private val todoRepo = TodoRepository.from(app)

    val settings: StateFlow<AppSettings> = settingsRepo.settings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AppSettings())

    val todos: StateFlow<List<TodoItem>> = todoRepo.items
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    // Loading installed apps touches PackageManager, so do it off the main thread, once.
    private var cachedApps: List<InstalledApp>? = null

    suspend fun installedApps(): List<InstalledApp> =
        cachedApps ?: withContext(Dispatchers.IO) {
            InstalledApps.list(getApplication())
        }.also { cachedApps = it }

    // ---- To-do actions ----
    fun addTodo(text: String) = viewModelScope.launch { todoRepo.add(text) }
    fun renameTodo(item: TodoItem, text: String) =
        viewModelScope.launch { todoRepo.rename(item, text) }
    fun setTodoDone(item: TodoItem, done: Boolean) =
        viewModelScope.launch { todoRepo.setDone(item.id, done) }
    fun deleteTodo(item: TodoItem) = viewModelScope.launch { todoRepo.delete(item) }

    // ---- Settings actions ----
    fun toggleWatched(pkg: String, watched: Boolean) = viewModelScope.launch {
        val current = settings.value.watchedPackages
        val updated = if (watched) current + pkg else current - pkg
        settingsRepo.setWatchedPackages(updated)
    }

    fun setThresholdMinutes(value: Int) =
        viewModelScope.launch { settingsRepo.setThresholdMinutes(value) }
    fun setBreakResetSeconds(value: Int) =
        viewModelScope.launch { settingsRepo.setBreakResetSeconds(value) }
    fun setCooldownMinutes(value: Int) =
        viewModelScope.launch { settingsRepo.setCooldownMinutes(value) }
    fun setEnabled(value: Boolean) =
        viewModelScope.launch { settingsRepo.setEnabled(value) }
}
