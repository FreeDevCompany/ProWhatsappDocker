export class RequestBuilder {
    static BuildHeaderForInternal = (headers: Record<string, string>): Record<string, string> => {
        return {
          ...{
            "Accept": "*/*",
            "Content-Type": "application/json",
          },
          ...(headers ?? {}),
        };
      };
      static SetEndPoint = (endpoint: string): string | undefined=> {
        try {
          let baseEndpoint = `${
            process.env.VITE_REACT_NODE_ENV === "PRODUCTION"
              ? process.env.VITE_REACT_APP_PRODUCTION_ENDPOINT
              : process.env.VITE_REACT_APP_DEVELOPMENT_ENDPOINT
          }${endpoint}`;
          let full_filled_endpoint = baseEndpoint;
          return full_filled_endpoint;
        } catch (error) {
          console.log(error);
        }
      };
}