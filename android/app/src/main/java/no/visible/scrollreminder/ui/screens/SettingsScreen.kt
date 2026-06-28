package no.visible.scrollreminder.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import no.visible.scrollreminder.ui.MainViewModel
import no.visible.scrollreminder.ui.theme.BrandOrange

@Composable
fun SettingsScreen(viewModel: MainViewModel) {
    val settings by viewModel.settings.collectAsStateWithLifecycle()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
    ) {
        Text(
            text = "Settings",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )

        Spacer(Modifier.height(16.dp))
        ToggleCard(
            title = "Watching on",
            subtitle = "Turn ScrollReminder off without losing your setup.",
            checked = settings.enabled,
            onChange = { viewModel.setEnabled(it) },
        )

        Spacer(Modifier.height(16.dp))
        StepperCard(
            title = "Reminder threshold",
            valueLabel = "${settings.thresholdMinutes} min",
            subtitle = "How long in a watched app before the reminder appears.",
            onDecrement = { viewModel.setThresholdMinutes(settings.thresholdMinutes - 1) },
            onIncrement = { viewModel.setThresholdMinutes(settings.thresholdMinutes + 1) },
        )

        Spacer(Modifier.height(12.dp))
        StepperCard(
            title = "Break resets timer",
            valueLabel = "${settings.breakResetSeconds} s",
            subtitle = "Leave the app this long and the sitting starts over. " +
                "A quick glance away won't reset it.",
            onDecrement = { viewModel.setBreakResetSeconds(settings.breakResetSeconds - 5) },
            onIncrement = { viewModel.setBreakResetSeconds(settings.breakResetSeconds + 5) },
        )

        Spacer(Modifier.height(12.dp))
        StepperCard(
            title = "Cooldown after a reminder",
            valueLabel = "${settings.cooldownMinutes} min",
            subtitle = "Don't nag again for this long in the same app.",
            onDecrement = { viewModel.setCooldownMinutes(settings.cooldownMinutes - 1) },
            onIncrement = { viewModel.setCooldownMinutes(settings.cooldownMinutes + 1) },
        )

        Spacer(Modifier.height(24.dp))
        Text(
            text = "Everything stays on your device. No accounts, no cloud, no internet.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun ToggleCard(
    title: String,
    subtitle: String,
    checked: Boolean,
    onChange: (Boolean) -> Unit,
) {
    Card {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(
                    title,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    subtitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Switch(checked = checked, onCheckedChange = onChange)
        }
    }
}

@Composable
private fun StepperCard(
    title: String,
    valueLabel: String,
    subtitle: String,
    onDecrement: () -> Unit,
    onIncrement: () -> Unit,
) {
    Card {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    title,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.weight(1f),
                )
                IconButton(onClick = onDecrement) {
                    Icon(Icons.Filled.Remove, contentDescription = "Decrease", tint = BrandOrange)
                }
                Text(
                    text = valueLabel,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.width(72.dp),
                )
                IconButton(onClick = onIncrement) {
                    Icon(Icons.Filled.Add, contentDescription = "Increase", tint = BrandOrange)
                }
            }
            Spacer(Modifier.height(4.dp))
            Text(
                subtitle,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun Card(content: @Composable () -> Unit) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(18.dp)) { content() }
    }
}
