package no.visible.scrollreminder.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

// ScrollReminder is intentionally always dark — black canvas, orange accents.
private val ScrollReminderColors = darkColorScheme(
    primary = BrandOrange,
    onPrimary = BrandBlack,
    secondary = BrandOrange,
    onSecondary = BrandBlack,
    background = BrandBlack,
    onBackground = BrandWhite,
    surface = SurfaceDark,
    onSurface = BrandWhite,
    surfaceVariant = SurfaceElevated,
    onSurfaceVariant = OnSurfaceMuted,
    outline = OutlineSubtle,
    error = BrandOrange,
    onError = BrandBlack,
)

@Composable
fun ScrollReminderTheme(
    // Brand is fixed regardless of system setting; param kept for previews/testing.
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = ScrollReminderColors,
        typography = ScrollReminderTypography,
        content = content,
    )
}
