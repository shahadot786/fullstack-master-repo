import apiClient from "./client";

export interface UploadResponse {
  id: string;
  publicId: string;
  url: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  originalFilename?: string;
  createdAt: Date;
}

export interface MyFilesResponse {
  files: UploadResponse[];
  total: number;
  limit: number;
  skip: number;
}

export const uploadApi = {
  /**
   * Upload a file (image or video)
   * POST /upload
   */
  uploadFile: async (
    fileUri: string,
    folder: string = "profile-images"
  ): Promise<UploadResponse> => {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = fileUri.split("/").pop() || "upload.jpg";
    
    // Append file to FormData
    formData.append("file", {
      uri: fileUri,
      type: "image/jpeg", // Default to JPEG, can be enhanced to detect actual type
      name: filename,
    } as any);
    
    formData.append("folder", folder);

    const response = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  /**
   * Delete uploaded file
   * DELETE /upload/:id
   */
  deleteFile: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/upload/${fileId}`);
  },

  /**
   * Get file by ID
   * GET /upload/:id
   */
  getFile: async (fileId: string): Promise<UploadResponse> => {
    const response = await apiClient.get(`/upload/${fileId}`);
    return response.data.data;
  },

  /**
   * Get all files uploaded by current user
   * GET /upload/my/files
   */
  getMyFiles: async (
    limit: number = 50,
    skip: number = 0
  ): Promise<MyFilesResponse> => {
    const response = await apiClient.get("/upload/my/files", {
      params: { limit, skip },
    });
    return response.data.data;
  },
};
