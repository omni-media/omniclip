<p align="center"><img width="300" src="./assets/icon2.png"/></p>
<p align="center"><a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/license-MIT-blue.svg"/></a></a></p>
<p align="center">Open source video editing web application</p>

## Introduction
Omniclip is a free and open source video editor that runs entirely in your browser. It requires no accounts, stores everything on your device, and never uploads your files.

Designed for privacy, speed, and flexibility — it gives you full editing control without relying on cloud services or subscriptions. You can use it directly, or embed its components into your own web projects.

Omniclip uses modern browser APIs like WebCodecs to achieve high performance rendering — directly in the browser.  
⚠️ Because of this, it may not work properly on older browsers or devices that don’t support these newer technologies.

## Features
  Omniclip is an actively maintained project with emerging features.  
- Trimming
- Splitting
- Supports - Text, Audio, Video (mp4, mov and much more) and Images
- Clip editing on preview - rotating, resizing, text styling and more
- Undo/Redo
- Render in different resolutions, up to 4k.
- Project manager - panel where you can choose from your saved projects, instead just one
- Transitions - Applying transitions between video clips for smooth visual effects
- Effects - filters
- Choose from various timebases ranging from 10-120 fps
- Collaboration (web rtc)

## To be added
- Audio Editing - Adjusting volume etc
- Speech to text
- Keyframes

## How to
  #### Use omniclip components in your app:
  1. Install omniclip:  
  ```sh
  npm install omniclip
  ```
  2. Import components and register them to the dom
  ```js
  import {getComponents, registerElements} from 'omniclip'
  registerElements(getComponents())
  ```
  3. Simply put the components you would like to use, or all components for whole experience:
  ```html
  <omni-text></omni-text>
  <omni-media></omni-media>
  <omni-timeline></omni-timeline>
  ```
#### Use omniclip tools:
Soon, Omniclip will be powered by [**Omni Tools**](https://github.com/omni-media/omnitool) — a programmatic engine for creating timelines from code, automating rendering, and integrating with AI or scripting workflows.

> ⚠️ **Note:** Omni Tools is still in early development, but it's shaping up to be a powerful foundation for building videos without a UI.

<!-- Tools will be added here once available: https://github.com/omni-media/omnitool -->

## Contributing
Contributing is vital part of this project, so feel free to help and build this awesome video editor together, simply choose the issue you feel like working on and if you are done make a pull request.
to ease communiaction, its best to join my discord server: https://discord.gg/Nr8t9s5wSM
#### Development:
To start contirbuting you need to do those steps first:
1. Clone the repository: `git clone git@github.com:omni-media/omniclip.git` or fork it
2. Install the dependencies: `npm install`
3. Build the project: `npm run build`
4. Start developing!: `npm start`

#### Project architecture
This project leverages the following key components for managing application state:
  1. State
  2. Actions
  3. Controllers
  4. Components/Views

The architecture follows a unidirectional data flow model, where data flows in a single direction from actions to state and from state to components.

#### Tech Stack
- Typescript
- @benev/slate

### Contact/Sponsorship
If you are willing to help this project by sponsoring it or have some other questions:
- discord: zenkyu
- gmail: przemekgg2002@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


