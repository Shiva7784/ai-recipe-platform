import { currentUser , auth } from "@clerk/nextjs/server";

export const checkUser = async () => {

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
    
    const user = await currentUser();
    console.log("strapi api key " , STRAPI_API_TOKEN)
    console.log("Checking user in Strapi with Clerk ID: ", user?.id);

    if (!user) {
        console.log("No user found");
        return null;
    }

    if (!STRAPI_API_TOKEN) {
        console.error("❌ STRAPI_API_TOKEN is missing in .env.local");
        return null;
    }

    const { has } = await auth();
    const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

    try{
        // Check if user exists in Strapi
        const existingUserResponse = await fetch(`${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
        }
    );

        if (!existingUserResponse.ok) {
            const errorText = await existingUserResponse.text();
            console.log("Strapi error response in checking user ", errorText);
            return null;
        }

        const existingUserData = await existingUserResponse.json();
        
        if (existingUserData.length > 0) {
            const existingUser = existingUserData[0];

            if(existingUser.subscriptionTier !== subscriptionTier) {
                await fetch(`${STRAPI_URL}/api/users/${existingUser.id}` , {
                    method : "PUT",
                    headers: {
                        "Content_Type": "application/json",
                        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                    },
                    body : JSON.stringify({ subscriptionTier}),
                });
            }
            return { ...existingUser, subscriptionTier };

        }

        // CREATE new user in Strapi 
        
        // Get authenticated role

        const roleResponse = await fetch(
            `${STRAPI_URL}/api/users-permissions/roles`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
        }
        );

        const rolesData = await roleResponse.json();

        console.log("authenticated role" , rolesData);
        
        const authenticatedRole = rolesData.roles.find(
            (roles) => roles.type === "authenticated"
        );

        if (!authenticatedRole) {
            console.error("❌ Authenticated role not found");
            return null;
        }

        // creating new user

        const userData = {
            username: user.username || user.emailAddresses[0].emailAddress.split('@')[0],
            email: user.emailAddresses[0].emailAddress,
            password: `clerk_managed_${user.id}_${Date.now()}`,
            confirmed: true,
            blocked: false,
            role: authenticatedRole.id,
            clerkId: user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            imageUrl: user.imageUrl || " ",
            subscriptionTier,
        };

        const newUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify(userData),
        });

        if(!newUserResponse.ok) {
            const errorText = await newUserResponse.text();
            console.error("❌ Error creating user: ", errorText);
            return null;
        }
        
        const newUser = await newUserResponse.json();

        return newUser;

    } catch(error){

        console.error("❌ Error in checkUser: ", error.message);
        return null;

    }

}