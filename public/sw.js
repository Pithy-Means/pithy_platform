if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, t) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[n]) return;
    let i = {};
    const o = (e) => a(e, n),
      r = { module: { uri: n }, exports: i, require: o };
    s[n] = Promise.all(c.map((e) => r[e] || o(e))).then((e) => (t(...e), i));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "25726eb4a0b8f507afcac65255b8eb1b",
        },
        {
          url: "/_next/static/DfFMXoNALFt6MHc7Wl9oE/_buildManifest.js",
          revision: "0ea7e7088aabf697ba3d8aa8c7b54a89",
        },
        {
          url: "/_next/static/DfFMXoNALFt6MHc7Wl9oE/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/087072f9-ad3a56c144f40edd.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/0e5ce63c-1c0a3af2ad43942a.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/2088-1a3bbe23fbc2f196.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/2117-ed702cda89038e1a.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/2207-6ca394c8b33796a8.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/223.c5c381c2376c7441.js",
          revision: "c5c381c2376c7441",
        },
        {
          url: "/_next/static/chunks/3145-5e25932f2c85abf4.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/3247-ef7619ddcffc93c9.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/3d47b92a-9ec73e31cdb978ee.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/4239-7fcf3b317ac53b0d.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/4472-71ef112829937011.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/521-fd47f62dbf18741f.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/539-3ecafbfdca147f78.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/53c13509-d6311d9f26e02807.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/5e22fd23-fd71dbef969be055.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/6180-1d6249a6c8bef062.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/6243-39a2b211485eadc7.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/6491-159a174f218adef6.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/66ec4792-85df1e78b6f29bab.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/7330-91f376b8f349d0d2.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/7648-b2c0ca01f4f1b22f.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/7695-39d458cc18b6366e.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/795d4814-41248b8b9dd6d824.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/8019-1fd7562a5d07c3a8.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/8668-8f0a6a36cd0fe7f8.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/8e1d74a4-cbeb2a462bcc085f.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/9064-4e03fda86c4663ff.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/9405-1a408ac1dbc52b92.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/9c4e2130-8d0e30f4ec6024d5.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(auth)/(reset-password)/reset-password/page-e3c76d613fac7dec.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(auth)/check-email/page-fdfd3fee86bcf2bd.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(auth)/forgot-password/page-ee9f00974fde0c26.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(auth)/layout-5a7dab7f9f26cbd3.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(auth)/signIn/page-8d67facee3b67d8c.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(auth)/signUp/page-1abef1ab7b95f19a.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(auth)/verify/page-ada96431a022fcad.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/courses/%5Bcourse_id%5D/page-b702664c069ee133.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/courses/page-d42367feedd76309.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/fundings/%5Bfunding_id%5D/page-54fbb44eecd62637.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/fundings/page-72242bbe02b95cb2.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/help/page-03d2f1d5cf3d272f.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/jobs/%5Bjob_id%5D/page-077c977f896aa07d.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/jobs/page-5c4c0f9d0030e8d9.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/layout-d26468172f2e8728.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/notifications/page-9ff23be766ab4c6f.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/page-c8b28b1b9e07e6d5.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/scholarships/%5Bscholarship_id%5D/page-41fcb782e153d652.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/scholarships/page-7c1117a0bad9b59d.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(pages)/403/page-25d3d96df80b4954.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(pages)/about/page-f938ca130ea7d447.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(pages)/contact/page-c47ced0fb2f890e8.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(pages)/how-it-works/page-33c5b766ab56d1da.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/(pages)/payment-status/page-e61a18d6a18fdcdc.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-db422ddd1a810b1d.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/admin/add_funding/page-c7c29b674d3dd436.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/admin/add_job/page-fce2b7285c42aaf8.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/admin/add_question/page-58c16924dccbf9ca.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/admin/add_scholarship/page-896377bffda566f6.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/admin/addcourse/page-f42b152dda6d9a46.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/admin/layout-a0b0f82ed2cffdd4.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/admin/page-f90937d8a8dafc60.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/layout-ef965b4de7c47e6b.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/page-e5b01b524cc71380.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/app/post/page-1b6f90a2f640e08e.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/d0deef33.e0722780845cf21c.js",
          revision: "e0722780845cf21c",
        },
        {
          url: "/_next/static/chunks/e34aaff9-825e29a814c27888.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/ee560e2c-b725c0bb5279489d.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/eec3d76d-671b0704423100f3.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/f7333993-48700910dfd61564.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/f97e080b-76d31b21bc3aa497.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/fd9d1056-3378abdbff6e1469.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/framework-a63c59c368572696.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/main-abd04d35e0e0f5d3.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/main-app-282fb8e3f94d9385.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/pages/_app-78ddf957b9a9b996.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/pages/_error-7ce03bcf1df914ce.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-b0417da6cc08b996.js",
          revision: "DfFMXoNALFt6MHc7Wl9oE",
        },
        {
          url: "/_next/static/css/27b4d6b789fddb24.css",
          revision: "27b4d6b789fddb24",
        },
        {
          url: "/_next/static/css/2ddd915403109162.css",
          revision: "2ddd915403109162",
        },
        {
          url: "/_next/static/css/857aa62baa17c894.css",
          revision: "857aa62baa17c894",
        },
        {
          url: "/_next/static/css/8696414957349dfe.css",
          revision: "8696414957349dfe",
        },
        {
          url: "/_next/static/media/4473ecc91f70f139-s.p.woff",
          revision: "78e6fc13ea317b55ab0bd6dc4849c110",
        },
        {
          url: "/_next/static/media/463dafcda517f24f-s.p.woff",
          revision: "cbeb6d2d96eaa268b4b5beb0b46d9632",
        },
        {
          url: "/_next/static/media/layers-2x.9859cd12.png",
          revision: "9859cd12",
        },
        {
          url: "/_next/static/media/layers.ef6db872.png",
          revision: "ef6db872",
        },
        {
          url: "/_next/static/media/marker-icon.d577052a.png",
          revision: "d577052a",
        },
        {
          url: "/_next/static/media/marker-icon.d577052a.png",
          revision: "2273e3d8ad9264b7daa5bdbf8e6b47f8",
        },
        {
          url: "/_next/static/media/marker-shadow.612e3b52.png",
          revision: "44a526eed258222515aa21eaffd14a96",
        },
        {
          url: "/apple-touch-icon.png",
          revision: "382e99d8ebbf9118f7d6a5261524dc79",
        },
        {
          url: "/assets/Arrow 3.png",
          revision: "21abe86b22572bd60f06e2e60a1ca12e",
        },
        {
          url: "/assets/Arrow2.png",
          revision: "aac08841bd39d40ff8a969c1a4a47c8f",
        },
        {
          url: "/assets/C05_6.png",
          revision: "e14a47f0683ba0a4a1a1ef28d5cb604f",
        },
        {
          url: "/assets/C12_22.png",
          revision: "62239527aa37719617e11d8237b34e0b",
        },
        {
          url: "/assets/C2_1.png.png",
          revision: "6de953f64daf01f50fcd070a940f418c",
        },
        {
          url: "/assets/C2_15.png",
          revision: "9f99300c88aafe88c32efc25c3c88ec2",
        },
        {
          url: "/assets/Frame 87.png",
          revision: "a7c8403d84c77524c3c410cb59e35df0",
        },
        {
          url: "/assets/Frame 88.png",
          revision: "c7abbfd50bcfbfa81168f542839adecd",
        },
        {
          url: "/assets/Group 3473673.png",
          revision: "57939bc09ba5875f1ac87e6c428fba5a",
        },
        {
          url: "/assets/Group3473707.png",
          revision: "977e008f9edfb193ce14e8db06db00a6",
        },
        {
          url: "/assets/Layer_1.png",
          revision: "edd8e099e3294d3d2790407cd72712af",
        },
        {
          url: "/assets/Standing_ladies.png",
          revision: "b28450ba61ae90d538914e6f2bea92d7",
        },
        {
          url: "/assets/airtel.png",
          revision: "b06a370811c3d7f542dd56333979cbbe",
        },
        {
          url: "/assets/backward.png",
          revision: "68860b8c139b5df4e6cc2f31d49272ed",
        },
        {
          url: "/assets/briefcase-04.png",
          revision: "9258e56db714bc6df1c641391828c752",
        },
        {
          url: "/assets/cancel-circle.png",
          revision: "d496493213fe1de685550100f2696d23",
        },
        {
          url: "/assets/development1.png",
          revision: "9ff8e86fa28e843556318821255d485a",
        },
        {
          url: "/assets/development2.png",
          revision: "9079ef5a922e850f9bfc296756b4cd33",
        },
        {
          url: "/assets/discount.png",
          revision: "57939bc09ba5875f1ac87e6c428fba5a",
        },
        {
          url: "/assets/flesh.png",
          revision: "e43b6a6f0fe91745d43f9b2061cd091a",
        },
        {
          url: "/assets/forward.png",
          revision: "7d1a4d68da5e4bf3e0a71c4f3b59e9c1",
        },
        {
          url: "/assets/green-line.png",
          revision: "958b43a4582189db52435f6c0d111801",
        },
        {
          url: "/assets/green.png",
          revision: "8cf0a78af4b4f2fc2ad97bf5fa3e4d7d",
        },
        {
          url: "/assets/images.jpeg",
          revision: "8033adaadd1809870dca0bf4c9e02b94",
        },
        {
          url: "/assets/leftfooter.png",
          revision: "2b48a79f0493447cd99e95cab7fd1589",
        },
        {
          url: "/assets/lineone.png",
          revision: "e9a2dabcc0cb8228f80f25bc8d018b01",
        },
        {
          url: "/assets/linetwo.png",
          revision: "e5271fa29fdb11bf71951f0eccbf2416",
        },
        {
          url: "/assets/logo.png",
          revision: "28f3eea90ec91c3d212be4f4816ed8f8",
        },
        {
          url: "/assets/mtn.png",
          revision: "915e6a3e5830405aa0a06aee518ddf07",
        },
        {
          url: "/assets/one.png",
          revision: "38e7b208aea36ba96cbffd67ebb8ada4",
        },
        {
          url: "/assets/person_feedback.png",
          revision: "d5901fd6577a82e6ed97e2fa046854dc",
        },
        {
          url: "/assets/post_image.png",
          revision: "7243880d56f923395efa05f040782c53",
        },
        {
          url: "/assets/report.png",
          revision: "e6fe4df7d2f5804c306d39519c6bb20b",
        },
        {
          url: "/assets/rightfooter.png",
          revision: "f9e91094a572782739debecd7653c8cf",
        },
        {
          url: "/assets/sign.png",
          revision: "cb524fd7e6b15e42a717c4ade9d1f876",
        },
        {
          url: "/assets/signin.png",
          revision: "a3dec05770abd4414c9f26e7978b2d62",
        },
        {
          url: "/assets/spiral.png",
          revision: "99f59d0649d691ae37940f1861a8f718",
        },
        {
          url: "/assets/square-lock-02.png",
          revision: "1f9b1a0ae95dcbd1d840727b0195c0b4",
        },
        {
          url: "/assets/start_price.png",
          revision: "455e2b0a9d11577afc037a1e6e60d926",
        },
        {
          url: "/assets/strike - stroke.png",
          revision: "4291f4acf2c75bfb6bb5704d716cc132",
        },
        {
          url: "/assets/three.png",
          revision: "bb42c4e3aa8dcabb7a3432dfe97e0be1",
        },
        {
          url: "/assets/two.png",
          revision: "5c11e1dc123b45467709f69bfb24ae1e",
        },
        {
          url: "/assets/visa.png",
          revision: "10f57107c130d24bd004100bd83c3b15",
        },
        {
          url: "/assets/whiteimage.png",
          revision: "c4d8de3bc94cc1dcbfbf5e682b363eb1",
        },
        {
          url: "/assets/whoweare.png",
          revision: "dc6b25a49d9f701889b0b799e7fd7c67",
        },
        {
          url: "/assets/woman.png",
          revision: "1de162749e3be2cc7910c5e982a895aa",
        },
        {
          url: "/countries.geo.json",
          revision: "9fdca94ef7b6bb7f63799d2fc5341e66",
        },
        {
          url: "/favicon-16x16.png",
          revision: "d77e6254384e3c9e96197d07a6dc1ca9",
        },
        {
          url: "/favicon-32x32.png",
          revision: "fe7436375194e2e5e872ef7591f5eadc",
        },
        { url: "/favicon.ico", revision: "9cb8f4299b09fe5365495ec97f7751dd" },
        { url: "/manifest.json", revision: "6e48687d252622beb0c852a0e1ee2060" },
        {
          url: "/videos/Career Change_ The Questions You Need to Ask Yourself Now _ Laura Sheehan .mp4",
          revision: "b87adce3b8591d0365546ffc7938462f",
        },
        {
          url: "/videos/Career advice for teenagers_ Value your values _ Amy MacLeod _ TEDxKanata.mp4",
          revision: "93ce38b9f1a27abcbebce2173821b01b",
        },
        {
          url: "/videos/To find work you love _ Benjamin Todd .mp4",
          revision: "1daf06a35972b7c31193d70d087269bf",
        },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: c,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    );
});
