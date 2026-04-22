import { defineConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: "content", dest: "." },
        { src: "assets/uploads", dest: "assets" }
      ]
    })
  ],
  server: {
    port: 8000,
    watch: { ignored: ["!**/content/**"] }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        post: resolve(__dirname, "post.html")
      }
    }
  }
});
