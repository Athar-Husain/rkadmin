import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, RESET_PRODUCT_STATE, deleteProduct } from '../../redux/productSlice';
import ProductModal from './ProductModal';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, filters, pagination, isProductLoading } = useSelector((state) => state.product);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(RESET_PRODUCT_STATE());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <button onClick={handleAdd} className="btn btn-primary mb-3">
        Add Product
      </button>

      {isProductLoading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <div className="mb-3">
            <strong>Filters: </strong>
            {filters?.categories && <span>Categories: {filters.categories.join(', ')} | </span>}
            {filters?.brands && <span>Brands: {filters.brands.join(', ')} | </span>}
            {filters?.priceRange && (
              <span>
                Price: ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
              </span>
            )}
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Active</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{p.category}</td>
                  <td>{p.formattedSellingPrice}</td>
                  <td>{p.overallStock}</td>
                  <td>{p.isActive ? 'Yes' : 'No'}</td>
                  <td>{p.isFeatured ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleEdit(p)} className="btn btn-sm btn-warning mx-1">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            Page {pagination.currentPage} of {pagination.pages}, Total Products: {pagination.total}
          </div>
        </>
      )}

      {showModal && <ProductModal product={selectedProduct} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ProductList;
