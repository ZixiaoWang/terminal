const DEFAULT_STRUCTURE = {
  "readme.md": true,
  photography: {
    "readme.md": `## This is the readme file for the photography folder\ntest`,
    "above_cloud.jpeg": true,
    "cows.jpeg": true,
    "men.jpeg": true,
    "rainbow_cloud.jpeg": true,
    "tower.jpeg": true,
    "bird.jpeg": true,
    "current.jpeg": true,
    "mine.jpeg": true,
    "urumqi.jpeg": true,
    "bird2.jpeg": true,
    "current_rock.jpeg": true,
    "mist.jpeg": true,
    "rock.jpeg": true,
    "village.jpeg": true,
    "blowball.jpeg": true,
    "fans.jpeg": true,
    "monk.jpeg": true,
    "see_with_2_colors.jpeg": true,
    "volcano.jpeg": true,
    "blue_cave.jpeg": true,
    "fountain.jpeg": true,
    "monoart.jpeg": true,
    "snow_mountain.jpeg": true,
    "water_drop.jpeg": true,
    "blue_light.jpeg": true,
    "green_mountain.jpeg": true,
    "monoart2.jpeg": true,
    "solar_eclipse.jpeg": true,
    "whalebones.jpeg": true,
    "boats.jpeg": true,
    "islands.jpeg": true,
    "north_korea.jpeg": true,
    "sunset.jpeg": true,
    "bridge.jpeg": true,
    "lava.jpeg": true,
    "oldman.jpeg": true,
    "sunset2.jpeg": true,
    "cloud.jpeg": true,
    "leave.jpeg": true,
    "oldman2.jpeg": true,
    "sunset3.jpeg": true,
    "colorful_brand.jpeg": true,
    "mantis.jpeg": true,
    "rainbow.jpeg": true,
    "sunset4.jpeg": true,
  },
  cats: {
    "cat00019.jpeg": true,
    "cat00036.jpeg": true,
    "cat00040.jpeg": true,
    "cat00044.jpeg": true,
    "cat00048.jpeg": true,
    "cat00052.jpeg": true,
    "cat00056.jpeg": true,
    "cat00060.jpeg": true,
    "cat00033.jpeg": true,
    "cat00037.jpeg": true,
    "cat00041.jpeg": true,
    "cat00045.jpeg": true,
    "cat00049.jpeg": true,
    "cat00053.jpeg": true,
    "cat00057.jpeg": true,
    "cat00061.jpeg": true,
    "cat00034.jpeg": true,
    "cat00038.jpeg": true,
    "cat00042.jpeg": true,
    "cat00046.jpeg": true,
    "cat00050.jpeg": true,
    "cat00054.jpeg": true,
    "cat00058.jpeg": true,
    "cat00062.jpeg": true,
    "cat00035.jpeg": true,
    "cat00039.jpeg": true,
    "cat00043.jpeg": true,
    "cat00047.jpeg": true,
    "cat00051.jpeg": true,
    "cat00055.jpeg": true,
    "cat00059.jpeg": true,
    "cat00063.jpeg": true,
  },
};

(() => {
  [
    ...Object.keys(DEFAULT_STRUCTURE.photography).map(
      (filename) => "/terminal/photography/" + filename
    ),
    ...Object.keys(DEFAULT_STRUCTURE.cats).map(
      (filename) => "/terminal/cats/" + filename
    ),
  ].forEach((path) => {
    const link = document.createElement("link");
    link.as = "image";
    link.rel = "prefetch";
    link.href = path;
    link.type = "image/jpeg";
    document.head.appendChild(link);
  });
})();
