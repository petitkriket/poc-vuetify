// @ts-check

"use strict";

/* eslint-disable @typescript-eslint/naming-convention -- See link below. */
// TODO: https://github.com/typescript-eslint/typescript-eslint/issues/1485.
const { VueLoaderPlugin } = require("vue-loader");
const autoprefixer = require("autoprefixer");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");
/* eslint-enable @typescript-eslint/naming-convention */

const paths = {
  src: path.join(__dirname, "src"),
  public: path.join(__dirname, "public")
};

// eslint-disable-next-line max-lines-per-function -- Okay for a config file.
module.exports = (_env, argv) => {
  /* eslint-disable @typescript-eslint/no-unsafe-member-access -- https://github.com/webpack/webpack/issues/11630 */
  const isDev = argv.mode === "development";
  const isHot = Boolean(argv.hot);
  /* eslint-enable @typescript-eslint/no-unsafe-member-access */

  /* eslint-disable sort-keys -- Not appropriate here. */
  return /** @type {import("webpack").Configuration} */ ({
    mode: isDev ? "development" : "production",
    context: paths.src,
    entry: "./main.ts",
    output: {
      path: paths.public,
      filename: `assets/scripts/${
        isHot ? "[name]" : "[name]-[contenthash:8]"
      }.js`,
      chunkFilename: `assets/scripts/${
        isHot ? "[name]" : "[name]-[contenthash:8]"
      }.chunk.js`,
      clean: true
    },
    cache: {
      type: "filesystem",
      cacheDirectory: path.join(
        __dirname,
        "../node_modules/.cache/vue3-vuetify3"
      ),
      buildDependencies: {
        config: [__filename]
      }
    },
    module: {
      // See https://webpack.js.org/configuration/module/#modulenoparse.
      noParse: /^(vue|vue-router)$/u,
      rules: [
        // Vue. (Note: This rule must be listed before the HTML rule.)
        {
          test: /\.vue$/u,
          use: [
            {
              loader: "vue-loader",
              options: {
                compilerOptions: {
                  whitespace: isDev ? "preserve" : "condense"
                }
              }
            }
          ]
        },
        // Fonts.
        {
          test: /\.woff2$/u,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[path][name]-[hash:8][ext]"
          }
        },
        // HTML.
        {
          test: /\.html$/u,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        // Images.
        {
          test: /\.(gif|ico|jpg|png|svg)$/u,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[path][name]-[hash:8][ext]"
          }
        },
        // JavaScript/TypeScript.
        {
          test: /\.[jt]s$/u,
          use: [
            {
              loader: "ts-loader",
              options: {
                appendTsSuffixTo: [/\.vue$/u],
                transpileOnly: true
              }
            }
          ],
          include: paths.src
        },
        // Sass.
        {
          test: /\.s[ac]ss$/u,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: "css-loader"
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [autoprefixer]
                }
              }
            },
            {
              loader: "resolve-url-loader"
            },
            {
              loader: "sass-loader"
            }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        "@": paths.src
      },
      extensions: [".mjs", ".ts", ".vue", "..."]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.join(__dirname, "tsconfig.json"),
          extensions: {
            vue: {
              enabled: true,
              compiler: "@vue/compiler-sfc"
            }
          }
        }
      }),
      new HtmlWebpackPlugin({
        template: path.join(paths.src, "index.html")
      }),
      new MiniCssExtractPlugin({
        filename: `assets/styles/${
          isHot ? "[name]" : "[name]-[contenthash:8]"
        }.css`,
        chunkFilename: `assets/styles/${
          isHot ? "[name]" : "[name]-[contenthash:8]"
        }.chunk.css`
      }),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        /* eslint-disable @typescript-eslint/naming-convention */
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
        /* eslint-enable @typescript-eslint/naming-convention */
      })
    ].filter(Boolean),
    optimization: {
      minimizer: ["...", new CssMinimizerPlugin()],
      runtimeChunk: {
        name: "runtime"
      },
      splitChunks: {
        chunks: "all",
        maxSize: 100000
      }
    },
    // The css-minimizer-webpack-plugin will not generate source maps when using `eval-*` values.
    devtool: isDev ? "source-map" : "hidden-source-map",
    devServer: {
      port: 3000,
      compress: true
    }
  });
  /* eslint-enable sort-keys */
};
