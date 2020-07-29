import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";

const manifests = create("pgweb", {
  env,
  config: {
    image: "sosedoff/pgweb:latest",
    subdomain: `pgweb-${process.env.CI_PROJECT_NAME as string}`,
  },
  deployment: {
    container: {
      livenessProbe: {
        httpGet: {
          path: "/",
          port: "http",
        },
        initialDelaySeconds: 5,
        timeoutSeconds: 3,
      },
      readinessProbe: {
        httpGet: {
          path: "/",
          port: "http",
        },
        initialDelaySeconds: 5,
        timeoutSeconds: 3,
      },
    },
    containerPort: 8081,
  },
});

// DEV: add secret to access DB
const deployment = manifests.find((manifest) => manifest.kind === "Deployment");
addPostgresUserSecret(deployment);

export default manifests;