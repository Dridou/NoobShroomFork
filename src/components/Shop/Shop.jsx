import React from "react";
import ShopItem from "@/components/ShopItem/ShopItem";
import "../../app/styles/colStyles.css"; // Import custom table styles
import "../../app/styles/tableStyles.css"; // Import custom table styles
import "./Shop.module.css";
import "../../app/posts/[slug]/singlePage.module.css";


const Shop = ({ shop }) => {
	if (!shop) {
		return <div>Shop not found</div>;
	}
	const { shopItems, money } = shop;
	const currentMoney = money[0];
	const secondMoney = money.length > 1 ? money[1] : null;

  return (
    <div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Image / Priority</th>
            <th>Name</th>
            <th>Price</th>
            <th>Explanation</th>
          </tr>
        </thead>
        <tbody>
          {shopItems.map((item) => (
            <ShopItem
              key={item.id}
              objectImage={item.objectImage}
              objectName={item.objectName}
              price={item.price}
              priority={item.priority}
              explanation={item.explanation}
              money={currentMoney}
              secondMoney={secondMoney}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Shop;








// const getBaseUrl = () => {
//   if (process.env.VERCEL_ENV === "production") {
//     return "https://www.noobshroom.com";
//   } else if (process.env.VERCEL_ENV === "preview") {
//     return `https://${process.env.VERCEL_URL}`;
//   } else {
//     return "http://localhost:3000";
//   }
// };

// const getData = async (shopId) => {
//   const res = await fetch(`${getBaseUrl()}/api/shops/${shopId}`);
//   if (!res.ok) {
//     throw new Error("Failed to fetch shop items");
//   }
//   const data = await res.json();
//   return data;
// };

// const Shop = async ({ params }) => {
// 	console.log("params", params)
//   const { shopId } = params; // Extraction du shopId des paramètres de la route
//   const shop = await getData(shopId);

//   if (!shop) {
//     return <div>Shop not found</div>;
//   }

//   const { shopItems, money } = shop;
//   const currentMoney = money[0];
//   const secondMoney = money.length > 1 ? money[1] : null;

//   return money.length == 0 ? (
//     <div></div>
//   ) : (
//     <div>
//       <table className="custom-table">
//         <thead>
//           <tr>
//             <th>Image / Priority</th>
//             <th>Name</th>
//             <th>Price</th>
//             <th>Explanation</th>
//           </tr>
//         </thead>
//         <tbody>
//           {shopItems.map((item) => (
//             <ShopItem
//               key={item.id}
//               objectImage={item.objectImage}
//               objectName={item.objectName}
//               price={item.price}
//               priority={item.priority}
//               explanation={item.explanation}
//               money={currentMoney}
//               secondMoney={secondMoney}
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Shop;
