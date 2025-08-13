import { toast } from "react-toastify";

export const categoryService = {
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
          { field: { Name: "product_count_c" } },
          { field: { Name: "subcategories_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("category_c", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(category => ({
        ...category,
        subcategories: category.subcategories_c ? category.subcategories_c.split(',') : []
      }));
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
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
          { field: { Name: "product_count_c" } },
          { field: { Name: "subcategories_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById("category_c", id, params);
      
      if (!response || !response.data) {
        throw new Error("Category not found");
      }
      
      return {
        ...response.data,
        subcategories: response.data.subcategories_c ? response.data.subcategories_c.split(',') : []
      };
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with ID ${id}:`, error.message);
      }
      throw new Error("Category not found");
    }
  },

  async create(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            Name: category.Name,
            product_count_c: category.product_count_c || 0,
            subcategories_c: Array.isArray(category.subcategories) ? category.subcategories.join(',') : (category.subcategories_c || ''),
            Tags: category.Tags || ''
          }
        ]
      };
      
      const response = await apperClient.createRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} category records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error("Error creating category:", error.message);
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
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.product_count_c !== undefined) updateData.product_count_c = updates.product_count_c;
      if (updates.subcategories_c !== undefined) updateData.subcategories_c = Array.isArray(updates.subcategories) ? updates.subcategories.join(',') : updates.subcategories_c;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} category records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating category:", error?.response?.data?.message);
      } else {
        console.error("Error updating category:", error.message);
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
      
      const response = await apperClient.deleteRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} category records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error("Error deleting category:", error.message);
      }
      throw error;
    }
  }
};