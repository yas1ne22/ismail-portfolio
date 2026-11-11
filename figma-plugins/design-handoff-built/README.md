# Design Handoff Built

An installable Figma Development Plugin that audits a selection or the current page and creates a prioritized handoff report beside the source design.

## Install in Figma Desktop

1. Unzip the downloaded package.
2. Open the Figma desktop app.
3. Open any Figma Design file.
4. Choose **Plugins → Development → Import plugin from manifest…**.
5. Select `manifest.json` from this folder.
6. Select a frame, then run **Plugins → Development → Design Handoff Built**.

## Checks

- Generic layer names
- Frames and components using manual layout
- Component instances without a resolvable main component
- Empty or unstyled text
- Named interaction targets smaller than 44 × 44 px
- Hidden layers included in the selected audit scope

The plugin does not modify source layers. It creates a separate report frame and limits scans to 5,000 layers and 10–200 reported findings.

## Publish later

When the owning Figma account has a Full/Dev seat with plugin publishing access, create or publish the plugin from Figma, preserve the name and functionality, and replace the development manifest ID with the ID assigned by Figma.
