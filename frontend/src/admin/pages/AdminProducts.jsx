import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Plus,
  Trash2,
  Edit,
  Package,
  UploadCloud
} from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/product.api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.products);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null,
    });

    setEditing(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));

    if (form.image) {
      formData.append("image", form.image);
    }

    if (editing) {
      await updateProduct(editing.id, formData);
      toast.success("Product updated successfully");
    } else {
      await createProduct(formData);
      toast.success("Product created successfully");
    }

    setOpen(false);
    resetForm();
    fetchProducts();
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      "Something went wrong"
    );
  }
};

const handleDelete = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-3">
          Are you sure you want to delete this product?
        </p>

        <div className="flex gap-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={async () => {
              try {
                await deleteProduct(id);

                toast.success("Product deleted");
                fetchProducts();
              } catch (error) {
                toast.error(
                  error?.response?.data?.message ||
                    "Delete failed"
                );
              }

              closeToast();
            }}
          >
            Delete
          </button>

          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={closeToast}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
    }
  );
};

  const handleEdit = (product) => {
    setEditing(product);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });

    setOpen(true);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package />
          Products Management
        </h1>

        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Image
              </th>
              <th className="p-4 text-left">
                Name
              </th>
              <th className="p-4 text-left">
                Price
              </th>
              <th className="p-4 text-left">
                Stock
              </th>
              <th className="p-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/60"
                      }
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  </td>

                  <td className="p-4 font-medium">
                    {product.name}
                  </td>

                  <td className="p-4">
                    Rs {product.price}
                  </td>

                  <td className="p-4">
                    {product.stock}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() =>
                          handleEdit(product)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-500"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {editing
                ? "Edit Product"
                : "Create Product"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full border rounded-lg p-3"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                required
                className="w-full border rounded-lg p-3"
              />

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="w-full border rounded-lg p-3"
              />

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
                className="w-full border rounded-lg p-3"
              />

              <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Product Image
  </label>

  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-500 transition-all duration-300">
    
    <UploadCloud className="w-10 h-10 text-blue-500 mb-3" />

    <p className="text-sm text-gray-700">
      <span className="font-semibold text-blue-600">
        Click to upload
      </span>{" "}
      or drag & drop
    </p>

    <p className="text-xs text-gray-400 mt-1">
      PNG, JPG, JPEG
    </p>

    {form.image && (
      <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
        {form.image.name}
      </div>
    )}

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) =>
        setForm({
          ...form,
          image: e.target.files[0],
        })
      }
    />
  </label>
</div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  {editing
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
