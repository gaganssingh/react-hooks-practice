import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const Ingredients = () => {
   const [userIngredients, setUserIngredients] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState();

   useEffect(() => console.log("rendering"), [userIngredients]);

   const filteredIngredientsHandler = useCallback((filteredIngredients) => {
      setUserIngredients(filteredIngredients);
   }, []);

   const addIngredientHandler = (ingredient) => {
      setIsLoading(true);

      fetch(`${process.env.REACT_APP_BACKEND_URL}/ingredients.json`, {
         method: "POST",
         body: JSON.stringify(ingredient), // Converts [] or {} in JSON
         headers: { "Content-Type": "application/json" },
      })
         .then((response) => {
            setIsLoading(false);
            return response.json();
         })
         .then((responseData) => {
            setUserIngredients((prevIngredients) => [
               ...prevIngredients,
               { id: responseData.name, ...ingredient },
            ]);
         })
         .catch((err) => {
            setError(err.message);
         });
   };

   const removeIngredientHandler = (id) => {
      setIsLoading(true);

      fetch(`${process.env.REACT_APP_BACKEND_URL}/ingredients/${id}.json`, {
         method: "DELETE",
      })
         .then((response) => {
            setIsLoading(false);
            setUserIngredients(userIngredients.filter((ing) => ing.id !== id));
         })
         .catch((err) => {
            setError("Oops! Something is not working here.");
            setIsLoading(false);
         });
   };

   const clearError = () => {
      setError(null);
   };

   return (
      <div className="App">
         {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
         <IngredientForm
            onAddIngredient={addIngredientHandler}
            loading={isLoading}
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
