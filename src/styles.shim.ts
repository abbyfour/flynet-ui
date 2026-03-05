/**
 *
 * THE ORDER IN THIS FILE MATTERS
 *
 * This file is a shim for styles that are imported in the app. It is used to ensure that the styles are imported in the correct order, and to avoid issues with CSS specificity.
 *
 * Edit this file thoughtfully.
 */

// Mantine styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// MapLibre styles
import "maplibre-gl/dist/maplibre-gl.css";

// Reset (must be after Mantine styles to avoid specificity issues)
import "./reset.css";

// App styles (must be after reset to avoid specificity issues)
import "./App.scss";
