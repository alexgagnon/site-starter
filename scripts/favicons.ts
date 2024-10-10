import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { favicons } from "favicons";
import { author, description, name, version } from "../package.json" with { type: 'json' };

const source = join('raw', 'favicon.svg'); // Source image(s). `string`, `buffer` or array of `string`
const dir = 'favicons';
const htmlDest = join('src', 'generated'); // Path for the HTML file to be saved. `string`
const filesDest = join('public', dir); // Path for the favicons files to be saved. `string`

const configuration = {
  path: "/favicons/", // Path for overriding default icons path. `string`
  appName: name, // Your application's name. `string`
  appShortName: name, // Your application's short_name. `string`. Optional. If not set, appName will be used
  appDescription: description, // Your application's description. `string`
  developerName: author, // Your (or your developer's) name. `string`
  developerURL: undefined, // Your (or your developer's) URL. `string`
  cacheBustingQueryParam: undefined, // Query parameter added to all URLs that acts as a cache busting system. `string | null`
  dir: "auto", // Primary text direction for name, short_name, and description
  lang: "en-US", // Primary language for name and short_name
  background: "#fff", // Background colour for flattened icons. `string`
  theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
  appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
  display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
  orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
  scope: "/", // set of URLs that the browser considers within your app
  start_url: "/?homescreen=1", // Start URL when launching the application from a device. `string`
  preferRelatedApplications: false, // Should the browser prompt the user to install the native companion app. `boolean`
  relatedApplications: undefined, // Information about the native companion apps. This will only be used if `preferRelatedApplications` is `true`. `Array<{ id: string, url: string, platform: string }>`
  version, // Your application's version string. `string`
  pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
  loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
  manifestMaskable: false, // Maskable source image(s) for manifest.json. "true" to use default source. More information at https://web.dev/maskable-icon/. `boolean`, `string`, `buffer` or array of `string`
  icons: {
    // Platform Options:
    // - offset - offset in percentage
    // - background:
    //   * false - use default
    //   * true - force use default, e.g. set background for Android icons
    //   * color - set background for the specified icons
    //
    android: true, // Create Android homescreen icon. `boolean` or `{ offset, background }` or an array of sources
    appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background }` or an array of sources
    appleStartup: true, // Create Apple startup images. `boolean` or `{ offset, background }` or an array of sources
    favicons: true, // Create regular favicons. `boolean` or `{ offset, background }` or an array of sources
    windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background }` or an array of sources
    yandex: true, // Create Yandex browser icon. `boolean` or `{ offset, background }` or an array of sources
  },
  shortcuts: [
    // Your applications's Shortcuts (see: https://developer.mozilla.org/docs/Web/Manifest/shortcuts)
    // Array of shortcut objects:
    // {
    //   name: "View your Inbox", // The name of the shortcut. `string`
    //   short_name: "inbox", // optionally, falls back to name. `string`
    //   description: "View your inbox messages", // optionally, not used in any implemention yet. `string`
    //   url: "/inbox", // The URL this shortcut should lead to. `string`
    //   icon: "test/inbox_shortcut.png", // source image(s) for that shortcut. `string`, `buffer` or array of `string`
    // },
    // more shortcuts objects
  ],
};

try {
  await mkdir(filesDest, { recursive: true });
  await mkdir(htmlDest, { recursive: true });

  const response = await favicons(source, configuration);

  await writeFile(join(htmlDest, 'favicons.html'), response.html.join('\n'));

  await Promise.allSettled([...response.images, ...response.files].map(async ({ name, contents }) => {
    // copy favicon.ico to root
    if (name === 'favicon.ico') {
      await writeFile(join('public', name), contents);
    };

    // copy other files to favicons directory
    await writeFile(join(filesDest, name), contents);
  }));

  await Promise.allSettled(response.images.filter(({ name }) => name === 'favicon.ico').map(({ contents }) => writeFile(join('public', 'favicon.ico'), contents)));

} catch (error) {
  console.log(error.message); // Error description e.g. "An unknown error has occurred"
}
