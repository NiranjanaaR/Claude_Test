package no.visible.scrollreminder

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.core.content.ContextCompat
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Apps
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import no.visible.scrollreminder.service.UsageMonitorService
import no.visible.scrollreminder.ui.MainViewModel
import no.visible.scrollreminder.ui.screens.OnboardingScreen
import no.visible.scrollreminder.ui.screens.SettingsScreen
import no.visible.scrollreminder.ui.screens.TodoListScreen
import no.visible.scrollreminder.ui.screens.WatchedAppsScreen
import no.visible.scrollreminder.ui.theme.ScrollReminderTheme
import no.visible.scrollreminder.util.Permissions

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    private val requestNotifications =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { /* best-effort */ }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        maybeRequestNotificationPermission()
        setContent {
            ScrollReminderTheme {
                AppRoot(viewModel, onSyncService = ::syncService)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        // Reconcile the service with the latest settings + permission state every time we
        // return to the app (the user may have just toggled a permission in Settings).
        syncService()
    }

    private fun maybeRequestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val granted = ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.POST_NOTIFICATIONS,
            ) == PackageManager.PERMISSION_GRANTED
            if (!granted) requestNotifications.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    /** Start the watcher when everything is in place; stop it otherwise. */
    fun syncService() {
        val s = viewModel.settings.value
        val ready = s.enabled &&
            s.watchedPackages.isNotEmpty() &&
            Permissions.hasUsageAccess(this)
        if (ready) UsageMonitorService.start(this) else UsageMonitorService.stop(this)
    }
}

private sealed class Tab(val route: String, val label: String, val icon: ImageVector) {
    data object Setup : Tab("setup", "Setup", Icons.Filled.Shield)
    data object Apps : Tab("apps", "Apps", Icons.Filled.Apps)
    data object Todo : Tab("todo", "To-do", Icons.AutoMirrored.Filled.List)
    data object Settings : Tab("settings", "Settings", Icons.Filled.Settings)
}

private val tabs = listOf(Tab.Setup, Tab.Apps, Tab.Todo, Tab.Settings)

@Composable
private fun AppRoot(viewModel: MainViewModel, onSyncService: () -> Unit) {
    val navController = rememberNavController()
    val backStack by navController.currentBackStackEntryAsState()
    val currentRoute = backStack?.destination?.route

    // Start/stop the watcher the moment the on/off toggle or watched-app set changes.
    val settings by viewModel.settings.collectAsStateWithLifecycle()
    LaunchedEffect(settings.enabled, settings.watchedPackages) {
        onSyncService()
    }

    Scaffold(
        bottomBar = {
            NavigationBar {
                tabs.forEach { tab ->
                    NavigationBarItem(
                        selected = currentRoute == tab.route,
                        onClick = {
                            if (currentRoute != tab.route) {
                                navController.navigate(tab.route) {
                                    popUpTo(Tab.Setup.route) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        },
                        icon = { Icon(tab.icon, contentDescription = tab.label) },
                        label = { Text(tab.label) },
                    )
                }
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Tab.Setup.route,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable(Tab.Setup.route) { OnboardingScreen(viewModel) }
            composable(Tab.Apps.route) { WatchedAppsScreen(viewModel) }
            composable(Tab.Todo.route) { TodoListScreen(viewModel) }
            composable(Tab.Settings.route) { SettingsScreen(viewModel) }
        }
    }
}
