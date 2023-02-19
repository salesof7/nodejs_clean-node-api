export const loginPath = {
  post: {
    tags: ["Login"],
    summary: "API para autenticar usuário",
    responses: {
      200: {
        description: "Sucesso",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/account",
            },
          },
        },
      },
      403: {
        $ref: "#/components/forbidden",
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
