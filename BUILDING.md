# GitHub download

Open **Actions > Plugin package > Run workflow**, then download **ComfyUI-Web-plugin**
from the successful run. Extract the artifact, then the plugin ZIP inside it.

Copy the contents of `Mr.G-ComfyUI-Plugin.Web` into the active ComfyUI web root's
`mrg` folder. Install the Mr.G backend plugin into `ComfyUI/custom_nodes` as well.
Open `http://127.0.0.1:8188/mrg/default.htm` after starting ComfyUI.
For the Mr.G ComfyUI fork, use `--front-end-root` to select your local web root.

The ZIP preserves the checked-in third-party scripts and their notices. CI checks
application JavaScript syntax, page dependencies, settings JSON and archive hashes.
It does not run image generation or establish compatibility with every ComfyUI release.
`bundle.htm` uses the backend's `/mrg/bundle` endpoint.
