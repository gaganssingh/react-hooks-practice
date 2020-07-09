import React, { useReducer, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientReducer = (currentIngredients, action) => {
   switch (action.type) {
      case "SET":
         return action.ingredients;
      case "ADD":
         return [...currentIngredients, action.ingredient];
      case "DELETE":
         return currentIngredients.filter((ing) => ing.id !== action.id);

      default:
         throw new Error("Should not get there!");
   }
};

const httpReducer = (currHttpState, action) => {
   switch (action.type) {
      case "SEND":
         return { loading: true, error: null };
      case "RESPONSE":
         return { ...currHttpState, loading: false };
      case "ERROR":
         return { loading: false, error: action.errorMessage };
      case "CLEAR":
         return { ...currHttpState, error: null };
      default:
         throw new Error("Should not be reached!");
   }
};

const Ingredients = () => {
   const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
   const [httpState, dispatchHttp] = useReducer(httpReducer, {
      loading: false,
      error: null,
   });

   useEffect(() => console.log("rendering"), [userIngredients]);

   const filteredIngredientsHandler = useCallback((filteredIngredients) => {
      dispatch({ type: "SET", ingredients: filteredIngredients });
   }, []);

   const addIngredientHandler = (ingredient) => {
      dispatchHttp({ type: "SEND" });

      fetch(`${process.env.REACT_APP_BACKEND_URL}/ingredients.json`, {
         method: "POST",
         body: JSON.stringify(ingredient), // Converts [] or {} in JSON
         headers: { "Content-Type": "application/json" },
      })
         .then((response) => {
            dispatchHttp({ type: "RESPONSE" });
            return response.json();
         })
         .then((responseData) => {
            dispatch({
               type: "ADD",
               ingredient: { id: responseData.name, ...ingredient },
            });
         })
         .catch((err) => {
            dispatchHttp({
               type: "ERROR",
               errorMessage: "Something went wrong!",
            });
         });
   };

   const removeIngredientHandler = (id) => {
      dispatchHttp({ type: "SEND" });

      fetch(`${process.env.REACT_APP_BACKEND_URL}/ingredients/${id}.json`, {
         method: "DELETE",
      })
         .then((response) => {
            dispatchHttp({ type: "RESPONSE" });
            dispatch({ type: "DELETE", id: id });
         })
         .catch((err) => {
            dispatchHttp({
               type: "ERROR",
               errorMessage: "Something went wrong!",
            });
         });
   };

   const clearError = () => {
      dispatchHttp({ type: "CLEAR" });
   };

   return (
      <div className="App">
         {httpState.error && (
            <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
         )}
         <IngredientForm
            onAddIngredient={addIngredientHandler}
            loading={httpState.loading}
         />

         <section>
            <Search onLoadIngredients={filteredIngredientsHandler} />
            <IngredientList
               ingredients={userIngredients}
               onRemoveItem={(id) => removeIngredientHandler(id)}
            />
         </section>
      </div>
   );
};

export default Ingredients;
