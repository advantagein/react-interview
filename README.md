# react-interview

Welcome to the Runway frontend exercise! We really appreciate you taking time to show us your
frontend development skills.

This repository is configured with a bunch of widely-used tools that are part of our
frontend engineering stack at Runway: React, NextJS, TypeScript, and more. It also includes
[Chakra UI](https://www.chakra-ui.com/docs/get-started/installation), a flexible component library that contains
handy building blocks for creating React apps.

Along with the tooling, you'll find a few components to help get you up and running on the
exercise. Our goal with the repo is to save you time creating a modern development
environment and writing boilerplate code. You're welcome to use some,
all, or none of what's included here. If you prefer to start with something like
[create-react-app](https://github.com/facebook/create-react-app) and to
borrow selectively from this repo, please feel free to do so.

## Installation

You can install dependencies using `pnpm install` and run the app using `pnpm dev`. I chose to replace yarn with `pnpm` because I have had much more success with `pnpm` on large-scale projects. If you want to talk about tooling preferences, I'd be happy to go into more detail!!

## Requirements

### Add row and column labels to the spreadsheet.

This was done via letters for columns, and numbers for rows.

### Display numeric cell values as comma-ized dollars (e.g. 1000 → $1,000).

The formatting of the cell in this regard only happens when the cell is not focused, to prevent the UI from inserting characters as the user types. I personally find that quite annoying when I use web applications.

### Add single-cell selection functionality, and allow user to move the selection with arrow keys.

I handled this by assigning a callback function to the `<Box>` component that is rendered at the top-level of the `<Spreadsheet>` component. I chose to do this so we didn't miss capturing any keyboard events, but I would spend additional time auditing if we could optimize this by defining the callback on a `<Cell>` level. Off the top of my head I don't know what the tradeoffs are enough to make a decision within the time limit.

### Additional features outside of scope

- I added a hover style to the cell so users get a bit of feedback that a cell is "clickable". After playing around with it some more, I think it's something worth keeping, but I don't like the interaction when you hover over a cell, click it, then use the keyboard to navigate to another cell. It keeps highlighting the cell that is hovered.

## Performance improvements

The way the original project was set up, each individual cell would re-render whenever the spreadsheet state updated. This caused a slight delay when attempting to type into a cell, even when the spreadsheet grid was relatively small. If we were to scale this application to much larger sizes, this would have severely hurt the performance of this application, causing massive usability issues.

So, I did a few things to improve the performance:

1. Choose a state management library other than `useState`. I picked Jotai because I am most recently familiar with it, but most state management libraries would have done the trick.
1. Refactor spreadsheet state out of the `Spreadsheet` component and into an atom. Now when we update the state, it won't attempt to re-render the entire `Spreadsheet` component and the underlying `Cell` components because `Spreadsheet` is unaware of this state (no more `useState`)
1. Update the `Cell` component to be aware of its own state, derived based on `colIdx` and `rowIdx` passed in as props.
1. Memoize the `Cell` component so it does not re-render unless properties change. In this case, since row and column are fixed values determined just once, the only thing that would cause it to re-render is internal state changing (atoms)
1. Wrap function calls with `useCallback` - this one might be overkill, but was my first attempt at optimizing the state. If I had more time, I would audit if any of these could be removed to reduce cognitive overhead of the codebase (code that is easy to read is easy to maintain).

## Things I would like to add or change if I had more time

1. Update styling of cells so that two borders touching don't create the appearance of a 2x border. I opted into keeping the Chakra UI usage from the seed project despite having no experience with it. I would have solved this with raw CSS, using CSS selectors to isolate individual borders.
1. The Jotai state works as expected, but I am surprised to see a couple of TypeScript typing errors from `useAtom()` usage. This is due to me using the most recent version of Jotai (2.x), but in my current projects where I use it I use version 1.x. I can downgrade to 1.x to get rid of the errors, but the better solution would be to catch up on possible API changes that caused these typing issues. Because the application functions properly, I am more inclined to spend time catching up to Jotai API changes.
1. Look into if it's possible to not use `useEffect()` in the `Cell` to focus the input when the arrow key changes. I strongly dislike using `useEffect`, but it was my first choice to solve this problem given the time constraints. It might be possible to imperatively find the input you are navigating to and focus it rather than rely on a side-effect. That would require being able to reference a `useRef` for another cell, which might be challenging or not worth it.

## Deployment

You can see a deployment for the project at https://react-interview-one.vercel.app/

If Vercel is functioning properly, you should be able to see a preview deployment for a merge request when you open it.

## Feedback about the exercise

Thanks for taking the time to review my submission! I had a lot of fun working on this.

A quick item worth addressing in the skeleton code - There is a broken link in the Chakra UI getting started link. I would update that in the seed project. I would also add `eslint-plugin-prettier` to the project and configure it into the eslint config to set expectations that all code should be formatted. One last edit to the seed project - I would configure `tsconfig.json` to not expect `import React from 'react'` in every file. While there was a point where importing React was necessary for a JSX/TSX file to function, this `jsx` configuration is an industry standard for React projects now.

I added the performance improvements despite the seed project managing state at the <Spreadsheet> level. I wasn't sure if you set up the seed project like this expecting me to find this issue, or if it was ok to ignore. The inner software engineer in me couldn't ignore it, having experience building spreadsheet applications at scale and knowing the potential footgun it could cause down the road.

I ended up forking the repo here: https://github.com/advantagein/react-interview. I did this so I could do some setup for the project beforehand, and show that work as separate from the feature work. I didn't have the spec on-hand while doing this, so I went ahead and integrated the repo with Vercel to deploy the application. I wanted you all to have the easiest time reviewing the deployed code, so you didn't have to do anything to run it locally. When I read the spec, I saw that you wanted the submission to be done in a .zip format. I will send this as a .zip, and **please let me know if you want me to delete my fork and Vercel deployment to not influence future submissions as forks cannot be set as private**. Thank you!
