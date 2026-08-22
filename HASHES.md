# Valkcryption public tree hashes (SHA-512)

`main` is the Node/JS line; `go-port` is the Go line (same GitHub repo, different branch).
This table lists public history on `main`, `go-port`, and tags `v1` / `go-v1`.

Each **SHA-512** is of `git archive --format=tar <commit>` (full repository tree at that commit; no `.git` directory).

**Tip hash** means: the SHA-512 of the full tree at the latest commit currently pointed to by that branch (`main` or `go-port`).

| When (America/Chicago) | Commit | Present on | Subject | SHA-512 of tree (`git archive`) |
|---|---|---|---|---|
| 2026-06-04 19:48:57 CDT | `cf94b7ef5c6aed1c32658e564ac39a9e994dfa1a` | main, tag:v1 | Initial public release: E2E encrypted paste links | `9801f0060174207efec5d165c83d0684f3ec11b7ab01c6aa777bed458b172d6d83dc558f0234c567cd3a897757b4b73b93f84876f341803eb77e5d4b7ddd8b7a` |
| 2026-06-04 20:21:05 CDT | `24fe861ef6efa8b7b062b5daddac94da50cd409c` | main, tag:v1 | Remove profile system; public keys live in /k/ URLs | `a393fc5d802753f9cab5e1ed85966d567f267a4656f87d2b81cc91bcddf534d944329b65121a69f7501f9fea866a8314b1c686ab2f037c34356af940d740daf3` |
| 2026-06-04 20:24:32 CDT | `f17532ba256192700a90003a823d199ab3e66621` | main | Fix /k/ page: read public key from URL path | `b5cc75784341d24b305ff42ed34d59d6e74f741306b94a918b5083c2c68f93890cfb279c19bc7f74776e532bef12b683083a5c9ae5b0780db5098336d90ec069` |
| 2026-06-04 21:04:57 CDT | `e81e4e0b55b45176e3b854e4245c29b865b40519` | main | Auto-grow textareas; remove nested scroll containers | `3e2a3a68466ad1fe9d372d6f4f9d0c8aec522cd6a34195dafefd4f914d1c6d90f8a7283487f20afa71ca6687407eb9aba78597fde7761fffda5e1c2e8355367e` |
| 2026-06-04 21:05:03 CDT | `76027fbb4281bed9822b39353e969cdf03a6e512` | main | Auto-grow keys backup textarea on export | `cbef1092384e7ad571e3c615d917446b6e3d695cb6524c2b5ad4ef4b793f79b66d07d599ce09c3736f1ce2e9e3bf82cc8d8af92fcb91d0d7a8df30f00bd61b19` |
| 2026-06-04 21:15:43 CDT | `fcd0824278fc3affe37e5c7bee81db47b658a043` | main | Stop duplicating paste URL in output footer | `399cc9e24290cfa811d4368c9bc10dd25e831510d0663dedc9e1d6debcb13d0399f213ff9cae8d707f9ebf9f158bbff7975da5b463fcb699a0a90516bd8037d9` |
| 2026-06-19 00:31:48 CDT | `eb9b411e751a0cc722d4aa61e188fc44c1a6f5df` | main | Change BASE_URL from valkcryption.it to valkcryption.com | `952999dfb1a192c4205ccc1dadf1c3fed6ad0500fbd6befffe00d9e29ab0b7a01b3e9269ca9ce24be703ebadbff199e17ff12d69eada881698d59bf878c77409` |
| 2026-06-24 23:25:08 CDT | `5d46eba1d3be2e18cde8d34c283db696f6ec65c3` | go-port, tag:go-v1 | Initial upload of Go version | `2dbfe7ea658ef14db39eb7067cc56bce8a415d59b3ebcbfaf0dbe93279c2eabfe82fc9ca99112397aa568100d8ae44f57abaffe7943cdcdd01187b77aeb1d653` |
| 2026-07-03 14:32:49 CDT | `55902100ff830e4da0c741524fc8335133d49b62` | main | Update VC_DOMAIN from valkcryption.it to valkcryption.com | `3a6ebb837abc0b0c6fdb42a93b99c59b217a5547f8df92263663fc8ecb8fa3d83d5570f753057001806ba7be260e3ffaf776d97de78406dfe9bfd0cdb7e6da28` |
| 2026-07-03 14:32:57 CDT | `4c9109644435db50d3cf851d56453a38089c2147` | main | Add note about valkcryption.it -> .com migration and self-host requirement for old chats | `e5fdf8c0aef4eac3edf02ad57c2d2a03287f4b28f5079ac70a3b6bf6d92f769e3a936e7119b4c8a582b0ccf626034061a457402185252dddf52481563f9d65c8` |
| 2026-07-03 14:33:00 CDT | `ea8455e37845c85c001ebad1d7df510bba7551e4` | main | Update crypto context string to .com and add compat note | `83187ec3b6b7d6de1e2534f5c6297a280735bc317c0864859b7110e5cf1370bb62241f00f067e07bcaf5f342882ab0dd864d1ec9d8a4535f22b566ee7cfa2521` |
| 2026-07-03 14:33:05 CDT | `c1641159d635a99c5a89bd835bcfb0b471e472f6` | main | Update default BASE_URL to valkcryption.com | `3094ee8dc0e57aa85b027d4f1dd98b28a3633405df8f90f2ffe0c5bd97c1219bb602428a6a297cc2619aa2a979ef87a6d5b1db1d61e872d6dcc3f6934a20968b` |
| 2026-07-06 22:54:27 CDT | `696efcc792c6a8b714322d4391030eb0f473f109` | main | Remove .it references (replace with .com); bump to v2 domain; add 'Links wont decrypt?' tab/page and update navs/routes | `357763e0a3b47a3d36c0de7dd94784111320e293919f3d71cac3fe3a3eadacde5b193332f9a1f596d08833154694155495225ac1820d0d93851f6ba014b0ccb1` |
| 2026-07-06 22:55:07 CDT | `67dbbda61d90028ceca79866be24c43036c4e3b4` | go-port | Go branch update: remove .it refs (update crypto to .com v2); add Links wont decrypt? tab; update navs, routes, defaults, README | `fcd9a38a2c3b14df89d99a2d786aa3d3f99381d40edac27f5d2a8cdedd9c632021fd31f172ddd4dfb24661c02598b299fb29dc3ab47e4017bf5c1033072f5389` |
| 2026-07-06 23:27:42 CDT | `50121c071ae01a29515ebf75b1a16bf26e4ede82` | main | Improve old version instructions: add concrete git checkout + ZIP download commands for v1 tag in README and /old-links page | `6dc16f3edef4ed07dd2a6f040df8b3f7790c06a3acf8ea6a9d15760846b14daadbc1e9668ffeabf2f72adfe370254d333823c5b3128153e149269b2229fc7cfd` |
| 2026-07-06 23:27:57 CDT | `c21568af197da6ba8b08029a3a038dddc4826e54` | go-port | Improve old version self-host instructions on go-port: concrete checkout + ZIP links for previous version (v1 tag and go-v1) | `607880925c8cb7474186be95b9ec8d7bf26e14b271f064af9d866b7f0db3fc4e129394a5884182c5450efa20baee1dd47dca39e03b6de70a7d9f6b9876c3748d` |
| 2026-07-06 23:31:18 CDT | `85977e262cb5d7d3930eb7118aff5a9dfccfe116` | main | Remove compiled binaries from source tree (add to .gitignore). Binaries can be built locally or attached to releases. | `4704280bd77214513e98864e9fd30dd026c70eded789977bd1b7b20ec3a65ee204568d71289d30bd08806dc5788702caa66000e207b6a52e80f31517b4cbc84a` |
| 2026-07-06 23:31:34 CDT | `860dfbf5fa4b8086c2fe6bb2ec1e84f031586234` | main | Link to GitHub Release v1 for downloading old version | `8ce02c0a4f3399d2a89b7d0967efc6211751df9c18da66f4f7b869bc141766abfe9b6cb373d2a1587bd0fabebf909983ed43ef0b5ba5722b89fa2a4f93d71ba9` |
| 2026-07-06 23:33:22 CDT | `03eb5767ed731fb6b5c43deb1ab1a4dc7c3a523e` | main | Update docs to clarify that the old v1 version uses .it in crypto (as expected for previous update) | `31ee0e68873da60d725ce169cdfea4f71cf669d4efc5a24f075f42851304fdd4d762b6a2ea31e8472a9fe20fc17b6db12f48bc1b9d95a9b1dbf8759af0979ea5` |
| 2026-07-16 11:16:09 CDT | `b959b2c60a8eecb0328ce553a6358176faaec6fa` | main | Use 00011110@valkcryption.com for contact and abuse reports | `03ea1a86194b917d2daa0a5a6e8f75c8657a9d3f3f05ffcb047706587f8824b9548978b0f5acb388e685dff997bfd4316ac533510c78cfe70ca9ce6efefccd8e` |
| 2026-07-16 11:16:10 CDT | `0843a02899e14c4c500fbefb9953369442cec225` | go-port | Use 00011110@valkcryption.com for contact and abuse reports | `1bcfccc4247273b927b5aafc2244638c28d7b041725f5176956fa845225b255708a6184391f2b945cf9896e6d500a29b5574e9bb83875efbfdc2274bdb0569d4` |
| 2026-07-22 14:19:59 CDT | `18e4d1e9839d70ee6db198659b51558ef516bc89` | main | Start of canary | `c72c52a770f3f97b340ebee7d659bc9c76c7bfc20feef588390012c4ca3bd1081a9c6b8a3d8b2ccaf8a9b09806c463309a20a2bdc58ecd44cc8ad7e4236d1dba` |
| 2026-08-22 02:14:29 CDT | `89a55fb30c64a88c70ce452c271aecf107bc03bf` | main | Warrant canary August 2026: key transition (nested PGP) | `aa4fcf6fa71d518cf623e5100b9df4c88c5f9662082ef2f748b63456bd901fac47751b8a796736eaed5f1d48457c628fb6d22e070fa3885176c90c8dc7ec97ff` |
| 2026-08-22 02:23:39 CDT | `daeaf0aa9d4e4b8464f6402ab53cdfee4c58d780` | main | Render PGP pubkeys in code fences for readable GitHub display | `da9fa2d4eb613ba1f3aada4307e3d7c65e53a5c338d2b65a9f71547de6034c24631ee66ca5bfeda2626c167a1569929320b1815c0665404f8f6004faaa7136bd` |
| 2026-08-22 02:26:56 CDT | `4d64d737a87747644065f4c0d46572f8e0f81460` | main | Fence July canary pubkey for readable GitHub display | `de7eb8238409738502038efca100e5b388137a5d938e57d81f401a7392ede86dc8ef26603af6a9154c893f101fe7d7afae6f4e08b1c2ecbb0edae49a4c2088e0` |

## Branch tips (at table generation, before this file is committed)

| Ref | Commit | Tip SHA-512 (`git archive`) |
|---|---|---|
| `main` | `4d64d737a87747644065f4c0d46572f8e0f81460` | `de7eb8238409738502038efca100e5b388137a5d938e57d81f401a7392ede86dc8ef26603af6a9154c893f101fe7d7afae6f4e08b1c2ecbb0edae49a4c2088e0` |
| `go-port` | `0843a02899e14c4c500fbefb9953369442cec225` | `1bcfccc4247273b927b5aafc2244638c28d7b041725f5176956fa845225b255708a6184391f2b945cf9896e6d500a29b5574e9bb83875efbfdc2274bdb0569d4` |

After `HASHES.md` itself is committed, `git archive main | sha512sum` will change. That is expected. Use the table for historical commits; hash your checked-out tip locally.

## How to verify (self-hosters / users)

```bash
git clone https://github.com/00011110/valkcryption.git
cd valkcryption
git checkout <commit-sha>   # or: main / go-port
git archive --format=tar HEAD | sha512sum
```

Compare the digest to the matching row (or re-hash your tip). If it differs, your tree does not match that published commit.

*Generated 2026-08-22 02:57:40 CDT.*
