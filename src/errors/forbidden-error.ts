import { ApplicationError } from "@/protocols";

export function forbidden(): ApplicationError {
console.log("ta no error")
  return {
    name: "Forbidden",
    message: "No result for this search!"
  };
}