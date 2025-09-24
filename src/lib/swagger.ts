import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Demo Project API",
      version: "1.0.0",
      description:
        "API documentation for the demo project with user authentication and admin features.",
      contact: {
        name: "API Support",
        email: "support@demoproject.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
      {
        url: "https://api.demoproject.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            first_name: {
              type: "string",
              minLength: 3,
              maxLength: 20,
              description: "User's first name",
            },
            last_name: {
              type: "string",
              maxLength: 20,
              description: "User's last name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            profile_photo: {
              type: "string",
              description: "URL to profile photo",
            },
            about: {
              type: "string",
              maxLength: 500,
              description: "About the user",
            },
            address: {
              type: "object",
              properties: {
                street_name: { type: "string", maxLength: 100 },
                pincode: { type: "number" },
                state: { type: "string" },
                country: { type: "string" },
              },
            },
            is_admin: {
              type: "boolean",
              description: "Whether user is admin",
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
              description: "User's gender",
            },
            date_of_birth: {
              type: "string",
              format: "date",
              description: "User's date of birth",
            },
            education_qualification: {
              type: "string",
              description: "User's education qualification",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        UserRegister: {
          type: "object",
          required: [
            "first_name",
            "email",
            "password",
            "about",
            "gender",
            "date_of_birth",
          ],
          properties: {
            first_name: {
              type: "string",
              minLength: 3,
              maxLength: 20,
              example: "John",
            },
            last_name: {
              type: "string",
              maxLength: 20,
              example: "Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              minLength: 3,
              maxLength: 60,
              example: "password123",
            },
            about: {
              type: "string",
              maxLength: 500,
              example: "I am a software developer",
            },
            address: {
              type: "object",
              properties: {
                street_name: {
                  type: "string",
                  maxLength: 100,
                  example: "123 Main St",
                },
                pincode: { type: "number", example: 12345 },
                state: { type: "string", example: "California" },
                country: { type: "string", example: "USA" },
              },
            },
            is_admin: {
              type: "boolean",
              default: false,
              example: false,
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
              example: "male",
            },
            date_of_birth: {
              type: "string",
              format: "date",
              example: "1990-01-15",
            },
            education_qualification: {
              type: "string",
              example: "Bachelor's in Computer Science",
            },
          },
        },
        UserLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "cerabrougayi-4944@yopmail.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },
        UserUpdate: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              minLength: 3,
              maxLength: 40,
              example: "John",
            },
            last_name: {
              type: "string",
              maxLength: 40,
              example: "Doe",
            },
            about: {
              type: "string",
              maxLength: 500,
              example: "Updated about section",
            },
            address: {
              type: "object",
              properties: {
                street_name: { type: "string", maxLength: 100 },
                pincode: { type: "number" },
                state: { type: "string" },
                country: { type: "string" },
              },
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
            },
            date_of_birth: {
              type: "string",
              format: "date",
            },
            education_qualification: {
              type: "string",
            },
          },
        },
        PasswordResetRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
            },
          },
        },
        PasswordReset: {
          type: "object",
          required: ["password"],
          properties: {
            password: {
              type: "string",
              minLength: 3,
              example: "newpassword123",
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            status: {
              type: "boolean",
              description: "Status of the request",
            },
            status_code: {
              type: "number",
              description: "HTTP status code",
            },
            message: {
              type: "string",
              description: "Response message",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "boolean",
              example: false,
            },
            status_code: {
              type: "number",
              example: 400,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            error: {
              type: "object",
              description: "Error details",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication required",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ForbiddenError: {
          description: "Insufficient permissions",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "User",
        description: "User management endpoints",
      },
      {
        name: "Admin",
        description: "Admin-only endpoints",
      },
    ],
  },
  apis: ["./src/router/*.ts", "./src/schema/*.ts"], // paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  // Swagger JSON endpoint
  app.get("/api-docs.json", (req: any, res: any) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Demo Project API Documentation",
    })
  );

  console.log(
    `📚 Swagger documentation available at http://localhost:${
      process.env.PORT || 4000
    }/api-docs`
  );
};
