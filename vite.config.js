// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const overlayPath = "Overlay";

/** @type {import('vite').UserConfig} */
export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, "src/components/Overlay/index.ts"),
            name: "Overlay",
            // the proper extensions will be added
            fileName: `${overlayPath}/overlay`,
            formats: ["cjs", "es", "iife", "umd"],
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            // external: ["vue"],
            output: {
                assetFileNames: ({ name, type }) => {
                    console.log(name, type);
                    // if(type == 'asset'){
                    // }
                    return `${overlayPath}/${name}`;
                },
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    // vue: "Vue",
                },
            },
        },
    },
    plugins: [
        dts({
            // rollupConfig: true,
            outDir: `dist/${overlayPath}`,
            entryRoot: resolve(__dirname, `src/components/${overlayPath}`),
        }),
    ],
});
