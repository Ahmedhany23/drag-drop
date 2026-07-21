# Drag and Drop Project

This project uses TypeScript for the app logic and Sass for styling.

## Setup

Install dependencies:

```bash
npm install
```

## Development

Run the app with live reload plus TypeScript and Sass watch mode:

```bash
npm run dev
```

## Sass build

If you change anything in `src/sass/`, it is compiled into `dist/main.css`.

Watch Sass only:

```bash
npm run sass
```

Build Sass once:

```bash
npm run sass:build
```

## Project Structure

- `src/sass/main.scss` is the Sass entry file.
- `dist/main.css` is the compiled stylesheet used by the app.
