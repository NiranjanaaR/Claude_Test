package no.visible.scrollreminder.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import no.visible.scrollreminder.ui.MainViewModel
import no.visible.scrollreminder.ui.theme.BrandOrange
import no.visible.scrollreminder.util.Permissions

@Composable
fun OnboardingScreen(viewModel: MainViewModel) {
    val context = LocalContext.current
    val hasUsage by rememberOnResume { Permissions.hasUsageAccess(context) }
    val hasOverlay by rememberOnResume { Permissions.hasOverlay(context) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
    ) {
        Text(
            text = "ScrollReminder",
            style = MaterialTheme.typography.displaySmall,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(6.dp))
        Text(
            text = "When you've been scrolling a while, ScrollReminder gently shows your " +
                "“things to do when I have time” list — a nudge, not a punishment.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )

        Spacer(Modifier.height(28.dp))
        Text(
            text = "Two permissions to set up",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = "Both are granted manually in system Settings. We never send anything " +
                "off your phone — there's no internet permission at all.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )

        Spacer(Modifier.height(20.dp))
        PermissionCard(
            title = "Usage access",
            why = "Lets ScrollReminder see which app is open so it can time your sitting. " +
                "It only reads the foreground app — not your content.",
            granted = hasUsage,
            onGrant = { context.startActivity(Permissions.usageAccessIntent()) },
        )

        Spacer(Modifier.height(14.dp))
        PermissionCard(
            title = "Draw over other apps",
            why = "Lets your to-do list appear on top of the app you're scrolling, " +
                "so the reminder actually reaches you.",
            granted = hasOverlay,
            onGrant = { context.startActivity(Permissions.overlayIntent(context)) },
        )

        Spacer(Modifier.height(24.dp))
        if (hasUsage && hasOverlay) {
            Text(
                text = "All set. Pick the apps to watch and add a few to-dos.",
                style = MaterialTheme.typography.titleMedium,
                color = BrandOrange,
            )
        }

        Spacer(Modifier.height(24.dp))
        Text(
            text = "Phone killing the watcher?",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = "Some phones (Samsung, Xiaomi…) aggressively stop background apps. " +
                "If reminders stop appearing, disable battery optimization for ScrollReminder.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(10.dp))
        Button(
            onClick = { context.startActivity(Permissions.batteryOptimizationIntent(context)) },
        ) { Text("Open app settings") }
    }
}

@Composable
private fun PermissionCard(
    title: String,
    why: String,
    granted: Boolean,
    onGrant: () -> Unit,
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.weight(1f),
                )
                if (granted) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Filled.CheckCircle,
                            contentDescription = "Granted",
                            tint = BrandOrange,
                        )
                        Spacer(Modifier.height(0.dp))
                        Text(
                            "  Granted",
                            color = BrandOrange,
                            fontWeight = FontWeight.SemiBold,
                        )
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
            Text(
                text = why,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            if (!granted) {
                Spacer(Modifier.height(14.dp))
                Button(onClick = onGrant) { Text("Grant") }
            }
        }
    }
}
