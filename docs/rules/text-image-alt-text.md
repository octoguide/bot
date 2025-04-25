# `text-image-alt-text`

> Images should have descriptive alt text.

> Included in config: ✅ recommended, 🔒 strict

Alternative text, or "alt text", is a text description attached to an image.
It allows non-sighted users and tools to understand the image despite not being able to visually see it.

## Setting Alt Text

Images should have alt text that describes their contents as if the reader cannot see the image at all.
In other words, a reader should be able to understand the meaning of the image without looking at it.

Blank or "file name" alt text content is not enough:

- ❌ `![](https://myoctocat.com/assets/images/base-octocat.svg)`: does not indicate what the image is at all
- ❌ `![base-octocat.svg](https://myoctocat.com/assets/images/base-octocat.svg)`: reads as _"base-octocat.svg"_, which does not explain what the image is

Image alt text should briefly explain what's in the image so that a non-visual reader doesn't miss any information:

- ✅ `![A GitHub "Octocat" mascot smiling and raising a tentacle](https://myoctocat.com/assets/images/base-octocat.svg)`

## "When Is Alt Text Necessary In Open Source?"

_Always_.

For web pages in general, alt text is necessary when an image is not "decorative" (such as a background image with no real content).
Decorative images may be marked as decorative or hidden, such as by using `alt=""`.

Inline images in GitHub comments are never decorative.
They are also always set as links to the image file.

You should _always_ put proper alt text on images.
Not doing so restricts users who can't visually see it:

- People who have low or no sight ("blind"), and rely on screenreaders to narrate page contents
- People who are on slow network connections that take too long to -or cannot at all- download images

## See More

- [github/accessibility-alt-text-bot](https://github.com/github/accessibility-alt-text-bot): a GitHub Action dedicated to image alt text detection
- [GitHub Docs: Basic writing and formatting syntax > Images](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images)
- [Rule source](../../src/rules/textImageAltText.ts)
