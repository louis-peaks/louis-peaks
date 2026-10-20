# Photos, banners and placeholders

## What is in this package

The included image files are local copies of the supplied **cream grid with a black rectangular frame**. The named slots make it clear where each image belongs and keep every page working before your final photos are ready.

The stock-photo pages below were selected as replacement suggestions. Their actual image files could not be downloaded in the preparation environment, so they are **not bundled**. Download an image from its linked source page on your own connection, save it to the appropriate slot and update the image description.

## Existing slots

| Purpose | File to replace |
| --- | --- |
| Home banner | `public/images/banners/home.jpg` |
| Challenge banner | `public/images/banners/challenge.jpg` |
| Journal banner | `public/images/banners/journal.jpg` |
| Sidequests banner | `public/images/banners/sidequests.jpg` |
| About banner | `public/images/banners/about.jpg` |
| Contact banner | `public/images/banners/contact.jpg` |
| Your portrait | `public/images/portraits/louis.jpg` |
| Starting-story image | `public/images/posts/start-with-a-direction.jpg` |
| Three-sports story image | `public/images/posts/learning-the-three-sports.jpg` |
| Kilometre-30 story image | `public/images/posts/lesson-from-kilometre-30.jpg` |
| Mountain sidequest | `public/images/sidequests/mountain-days.jpg` |
| Orienteering sidequest | `public/images/sidequests/orienteering-roots.jpg` |
| Experiments sidequest | `public/images/sidequests/experiments-and-detours.jpg` |
| Reusable placeholder reference | `public/images/placeholders/grid.jpg` |

The post and sidequest image names identify content slots. The grid image does not document those activities.

## Selected stock-photo sources

Source pages selected on **20 October 2026**. These are suggestions, not claims that an image depicts Louis or one of his completed activities.

| Subject / suggested use | Photographer | Source photo | Licence reference |
| --- | --- | --- | --- |
| Swiss mountain landscape — home banner | Jasper Hunter | [Scenic Swiss Alps mountain landscape](https://www.pexels.com/photo/scenic-swiss-alps-mountain-landscape-30688450/) | [Pexels License](https://www.pexels.com/license/) |
| Trail running — challenge or running article | Wolf Art | [Person running on a mountain footpath](https://www.pexels.com/photo/person-running-on-footpath-in-mountains-26700353/) | [Pexels License](https://www.pexels.com/license/) |
| Mountain-road cycling — triathlon article | Pack2Ride | [Cyclist on a mountain road in summer](https://www.pexels.com/photo/cyclist-on-mountain-road-in-summer-8934507/) | [Pexels License](https://www.pexels.com/license/) |
| Alpine lake — outdoor story or contact banner | Laura Otte | [Lake among green and snowy mountains](https://www.pexels.com/photo/lake-in-the-middle-of-green-and-snowy-mountains-7870474/) | [Pexels License](https://www.pexels.com/license/) |
| Distant alpine landscape — journal banner | Tobias Tullius | [Landscape photography of the mountain Alps](https://unsplash.com/photos/landscape-photography-of-mountain-alps-pR84nadNubs) | [Unsplash License](https://unsplash.com/license) |
| Hiking equipment — planning or experiments story | Alexander Mass | [Outdoor hiking gear with backpacks and notes](https://www.pexels.com/photo/outdoor-hiking-gear-with-backpacks-and-notes-38881957/) | [Pexels License](https://www.pexels.com/license/) |

Use the photo's source page to review the image and its current licence. Source descriptions guided selection; the binary images were not available for local visual inspection. The cycling source identifies its location as Türkiye, so do not caption it as Louis riding in Switzerland.

Keep the creator, photo link and licence link alongside any stock image you add. Illustrative stock images should not be presented as photos of you. Use your own actual portrait for `louis.jpg`.

## Choose useful image sizes

These are practical targets for this design, not strict file requirements:

| Image | Suggested export | Practical approach |
| --- | --- | --- |
| Wide banner | About 1,800–2,400 px wide | A landscape composition with room around the main subject. |
| Article/card cover | About 1,200–1,600 px wide | Landscape images work well for cards. |
| Portrait | About 900–1,200 px on the long side | Keep the face away from the edges. |
| Inline article photo | About 1,200–1,600 px wide | Choose the crop that best explains the story. |

Export a JPEG for straightforward replacements. Aim for a few hundred kilobytes per image where the quality remains good; avoid uploading full camera originals merely for a banner. The browser crops some images to fit the design, so check both phone and desktop layouts.

## Replace a slot without touching code

1. Download or export your chosen image.
2. Convert it to JPEG if necessary. Changing an extension alone does not convert a file.
3. Give it the same filename as the slot, for example `home.jpg`.
4. Replace `public/images/banners/home.jpg`.
5. Change `imageAlt` in `content/pages/home.json` to describe the actual new photo.
6. Run the build again, or commit the change to GitHub for Cloudflare to build.

If keeping a different filename or using another supported image format, update the content path accordingly. For example, the source file `public/images/posts/ridge-at-sunrise.webp` is referenced as `/images/posts/ridge-at-sunrise.webp`.

## Alt text and credits

Alt text describes what is visually useful in the image. For example: “A narrow trail follows a rocky ridge above low cloud.” Avoid filenames or claims about an athlete's identity unless you know them to be true.

A simple credit record is:

```text
File: public/images/banners/home.jpg
Photo: [photo title]
Photographer: [name]
Source: [source-page URL]
Licence: [licence URL]
Changes: resized and cropped
```

The initial credits page describes the supplied placeholders. Edit `content/pages/credits.md` to update the visible credits page when replacing them with other photographs, and keep this document's records accurate. The selected photo links above are not automatically fetched or published as credits for images you have not used.
