import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const productService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "in_stock_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "category_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("product_c", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(product => ({
        ...product,
        images: product.images_c ? product.images_c.split(',') : ['/api/placeholder/600/600']
      }));
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching products:", error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "in_stock_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "category_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("product_c", id, params);
      
      if (!response || !response.data) {
        throw new Error("Product not found");
      }
      
      return {
        ...response.data,
        images: response.data.images_c ? response.data.images_c.split(',') : ['/api/placeholder/600/600']
      };
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching product with ID ${id}:`, error.message);
      }
      throw new Error("Product not found");
    }
  },

  async getProductsByCategory(categoryName) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "in_stock_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "category_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "Contains",
            Values: [categoryName]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("product_c", params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data.map(product => ({
        ...product,
        images: product.images_c ? product.images_c.split(',') : ['/api/placeholder/600/600']
      }));
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by category:", error?.response?.data?.message);
      } else {
        console.error("Error fetching products by category:", error.message);
      }
      return [];
    }
  },

  async searchProducts(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "in_stock_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "category_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "description_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "Tags",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("product_c", params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data.map(product => ({
        ...product,
        images: product.images_c ? product.images_c.split(',') : ['/api/placeholder/600/600']
      }));
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching products:", error?.response?.data?.message);
      } else {
        console.error("Error searching products:", error.message);
      }
      return [];
    }
  },

  async getFeaturedProducts() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "in_stock_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "category_c" } }
        ],
        where: [
          {
            FieldName: "rating_c",
            Operator: "GreaterThanOrEqualTo",
            Values: ["4"]
          }
        ],
        orderBy: [
          {
            fieldName: "rating_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 8,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords("product_c", params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data.map(product => ({
        ...product,
        images: product.images_c ? product.images_c.split(',') : ['/api/placeholder/600/600']
      }));
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching featured products:", error.message);
      }
      return [];
    }
  },

  async create(product) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            Name: product.title_c,
            title_c: product.title_c,
            price_c: product.price_c,
            description_c: product.description_c,
            images_c: Array.isArray(product.images) ? product.images.join(',') : product.images_c,
            rating_c: product.rating_c || 0,
            review_count_c: product.review_count_c || 0,
            in_stock_c: product.in_stock_c !== undefined ? product.in_stock_c : true,
            Tags: product.Tags || '',
            category_c: parseInt(product.category_c)
          }
        ]
      };
      
      const response = await apperClient.createRecord("product_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} product records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
      } else {
        console.error("Error creating product:", error.message);
      }
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: id
      };
      
      // Only include updateable fields
      if (updates.title_c !== undefined) updateData.title_c = updates.title_c;
      if (updates.price_c !== undefined) updateData.price_c = updates.price_c;
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c;
      if (updates.images_c !== undefined) updateData.images_c = Array.isArray(updates.images) ? updates.images.join(',') : updates.images_c;
      if (updates.rating_c !== undefined) updateData.rating_c = updates.rating_c;
      if (updates.review_count_c !== undefined) updateData.review_count_c = updates.review_count_c;
      if (updates.in_stock_c !== undefined) updateData.in_stock_c = updates.in_stock_c;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.category_c !== undefined) updateData.category_c = parseInt(updates.category_c);
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("product_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} product records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
      } else {
        console.error("Error updating product:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord("product_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} product records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
      } else {
        console.error("Error deleting product:", error.message);
      }
      throw error;
throw error;
    }
  }
};