# Microformats JavaScript/Node Parser Website

Website for Microformats JavaScript parser (based on pin13.net by [@aaronpk](https://github.com/aaronpk)).

https://node.microformats.io

## Deployment

All commits to the `main` branch get auto-deployed to the live website [running on Heroku](https://node.microformats.io).

### Git workflow

The base branch is `next`. All PRs should target this branch.

To initiate a release:

- Create a new branch, from `next` named `release/x.y.z`
- Bump the version in `package.json` to `x.y.z`
- Merge `release/x.y.z` to `main`. This will trigger the [deployment](#deployment).
- Merge `main` into `next`

## Getting Started

This website is built using [Yarn](https://yarnpkg.com/).

To start working with this project, first clone the repository for this project:

```
git clone https://github.com/microformats/microformats-parser-website-node.git
cd microformats-parser-website-node
```

Next, install the required dependencies and start the server:

```
yarn install
yarn start
# Or, if you'd like a different port:
# PORT=5000 yarn start
```

You can view your running local application at this URL:

```
http://localhost:9000
```

## Requirements

- [Node 17](https://nodejs.org/en/blog/release/v17.0.0/)
- [Yarn](https://yarnpkg.com/cli/install)

## Contributions

1. Fork it
2. Get it running (see Installation above)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create new Pull Request

If you find bugs, have feature requests or questions, please
[file an issue](https://github.com/microformats/microformats-parser-website-node/issues).

## License

Microformats Parser Website Node is dedicated to the public domain using Creative Commons -- CC0 1.0 Universal.

http://creativecommons.org/publicdomain/zero/1.0
