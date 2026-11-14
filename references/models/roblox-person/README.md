# RobloxPerson 3D character

This folder contains the default procedural humanoid character for the Cartoon 3D Shorts pipeline.

## Why this exists

The pipeline needs a reliable 3D character that can be generated directly in Three.js without requiring an external model or texture file.

The design is Roblox-inspired: block torso, separate block head, four articulated limbs, hands, shoes, simple hair cap and a minimal face.

## Default selection

Use `RobloxPerson` for normal 3D character shots.

The Francarlos asset is **not** the default character and must never be selected merely because it exists in the repository.

## Francarlos opt-in

Only use Francarlos when the user explicitly requests it or the skill invocation explicitly enables the Francarlos 3D mode.

Expected opt-in wording includes:
- `use the Francarlos model`
- `use Francarlos`
- `Francarlos 3D mode`

When that mode is not enabled, do not load `references/models/francarlos/*`.

## Usage

Import `createRobloxPerson` from `./roblox-person` and add the returned `THREE.Group` to the scene.

The character exposes `applyPose`, `walk`, `idle`, and `jump` helpers.