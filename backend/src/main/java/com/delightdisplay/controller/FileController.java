package com.delightdisplay.controller;

import com.delightdisplay.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File upload endpoints")
public class FileController {
    private final FileStorageService fileStorageService;

    @PostMapping("/upload/product")
    @Operation(summary = "Upload product image")
    public ResponseEntity<Map<String, String>> uploadProductImage(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file, "products");
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/upload/category")
    @Operation(summary = "Upload category image")
    public ResponseEntity<Map<String, String>> uploadCategoryImage(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file, "categories");
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/upload/avatar")
    @Operation(summary = "Upload user avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file, "avatars");
        return ResponseEntity.ok(Map.of("url", url));
    }

    @DeleteMapping
    @Operation(summary = "Delete file")
    public ResponseEntity<Void> deleteFile(@RequestParam String path) {
        fileStorageService.deleteFile(path);
        return ResponseEntity.noContent().build();
    }
}
