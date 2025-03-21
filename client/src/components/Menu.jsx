"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import URL from "@/lib/address";
import { Card } from "./ui/card";

export default function Menu({ restaurantId }) {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get(`${URL}/api/restaurant/${restaurantId}/menu`);
                setMenu(response.data);
            } catch (err) {
                setError("Failed to load menu");
                console.error("Error fetching menu:", err);
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchMenu();
        }
    }, [restaurantId]);

    if (loading) return <p>Loading menu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="m-2">
            <ul>
                {menu.map((item) => (
                    <Card key={item._id} className="m-3">
                        <li>
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Category: {item.category}</p>
                            {/* <p>Type: {item.foodType}</p> */}
                            <p>Price: ${item.price}</p>
                            {item.image && <img src={item.image} alt={item.name} width={100} />}
                        </li>
                    </Card>
                ))}
            </ul>
        </div>
    );
}
