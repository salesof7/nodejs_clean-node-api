export const surveyPath = {
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ["Enquete"],
    summary: "API para listar todas as enquetes",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/loginParams",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Sucesso",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/surveys",
            },
          },
        },
      },
      400: {
        $ref: "#/components/badRequest",
      },
      401: {
        $ref: "#/components/unauthorized",
      },
      404: {
        $ref: "#/components/notFound",
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
};
