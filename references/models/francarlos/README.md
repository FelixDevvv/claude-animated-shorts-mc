# Francarlos — 3D character asset

The supplied character is a **3D Wavefront OBJ** exported from Roblox Studio.

Expected asset:
- `francarlos.obj`
- The OBJ declares `mtllib francarlos.mtl`.
- The companion `francarlos.mtl` is now included in this folder. It maps the model materials to `Handle1_diff.png` for the diffuse/alpha texture.

## Usage

Use this model as the character geometry in the 3D short pipeline. Do **not** convert it into the legacy 2D bean/card character unless a shot explicitly asks for a sprite.

Recommended rendering:
- real perspective camera
- scene lighting and contact shadows
- depth-of-field focused on the face/eyes
- real 3D transforms/rig animation when available
- grounded feet and consistent scale
