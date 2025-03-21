// import { useRouter } from "next/router";
import Menu from "@/components/Menu";

export default function Restaurant() {
    // const router = useRouter();
    const id = "67d7ea5473ca82e8115923bd"; // Get restaurant ID from the URL

    if (!id) return <p>Loading restaurant...</p>; 

    return (
        <div>
            {/* <h1>Restaurant Page</h1> */}
            <Menu restaurantId={id} /> 
        </div>
    );
}
