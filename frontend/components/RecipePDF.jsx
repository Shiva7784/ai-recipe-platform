import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  recipeImage: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#1c1917",
  },

  section: {
    marginBottom: 18,
  },

  heading: {
    fontSize: 15,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#ea580c",
  },

  text: {
    marginBottom: 5,
    lineHeight: 1.5,
    color: "#44403c",
  },

  metaBox: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: "#fff7ed",
    borderRadius: 8,
  },

  stepBox: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
  },
});

export function RecipePDF({ recipe }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Recipe Image */}
        {recipe.imageUrl && (
          <Image
            src={recipe.imageUrl}
            style={styles.recipeImage}
          />
        )}

        {/* Title */}
        <Text style={styles.title}>{recipe.title}</Text>

        <Text style={styles.text}>
          {recipe.description}
        </Text>

        {/* Meta */}
        <View style={styles.metaBox}>
          <Text style={styles.text}>
            Cuisine: {recipe.cuisine} | Category: {recipe.category}
          </Text>

          <Text style={styles.text}>
            Time:{" "}
            {parseInt(recipe.prepTime) +
              parseInt(recipe.cookTime)}{" "}
            mins
          </Text>

          <Text style={styles.text}>
            Servings: {recipe.servings}
          </Text>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.heading}>
            Ingredients
          </Text>

          {recipe.ingredients.map((ing, i) => (
            <Text key={i} style={styles.text}>
              • {ing.item} — {ing.amount}
            </Text>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.heading}>
            Instructions
          </Text>

          {recipe.instructions.map((step) => (
            <View
              key={step.step}
              style={styles.stepBox}
            >
              <Text style={styles.text}>
                {step.step}. {step.title}
              </Text>

              <Text style={styles.text}>
                {step.instruction}
              </Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        {recipe.tips?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>
              Chef’s Tips
            </Text>

            {recipe.tips.map((tip, i) => (
              <Text key={i} style={styles.text}>
                • {tip}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}