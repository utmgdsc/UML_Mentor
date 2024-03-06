# Contributing Guide

## Installation
In the client directory run `npm install` to install the dependencies.
Run `npm run dev` to start the development server.

## The stack
We are using Vite with typescript to compile 
React. On top of Bootstrap, we use
[React-bootstrap](https://react-bootstrap.netlify.app/) bindings. We use
React-router for client-side routing.

## Development Environment
We are using eslint for code quality checks as well as prettier for style. Many
IDEs link with these tools to make your development experience better. If there 
are conflicting eslint and prettier rules check
[this](https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#special-rules)
out.

## File Structure
We use an atomic file structure where we extract pages, components and hooks
into their separate files.
