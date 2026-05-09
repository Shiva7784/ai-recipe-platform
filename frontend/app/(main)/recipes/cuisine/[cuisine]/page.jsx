"use client";

import { getMealsByArea } from "@/actions/mealdb.actons";
import RecipeGrid from "@/components/RecipeGrid";
import { useParams } from "next/navigation";

export default function CuisineRecipesPage() {
    const params = useParams();
    const cuisine = params.cuisine;

    return (
        <RecipeGrid
            type="ccuisine"
            value={cuisine}
            fetchAction={getMealsByArea}
            backLink="/dashboard"
        
        />
    )
}