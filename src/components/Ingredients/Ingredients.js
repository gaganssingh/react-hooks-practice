import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";

import Search from "./Search";

const Ingredients = () => {
   const [userIngredients, setUserIngredients] = useState([]);

   const addIngredientHandler = (ingredient) => {
      setUserIngredients((prevIngredients) => [
         ...prevIngredients,
         { id: Math.random().toString(), ...ingredient },
      ]);
   };

   const removeIngredientHandler = (id) => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/ingredients`);

      setUserIngredients(userIngredients.filter((ing) => ing.id !== id));
   };

   return (
      <div className="App">
         <IngredientForm onAddIngredient={addIngredientHandler} />

         <section>
            <Search />
            <IngredientList
               ingredients={userIngredients}
               onRemoveItem={(id) => removeIngredientHandler(id)}
            />
         </section>
      </div>
   );
};

export default Ingredients;
