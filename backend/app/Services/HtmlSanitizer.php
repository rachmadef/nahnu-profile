<?php

namespace App\Services;

class HtmlSanitizer
{
    /**
     * Allowed HTML tags for Quill editor content.
     */
    protected const ALLOWED_TAGS = '<p><br><h1><h2><h3><h4><h5><h6><strong><b><em><i><u><s><strike><blockquote><ul><ol><li><a><code><pre><img><hr><table><thead><tbody><tr><th><td><span>';

    /**
     * Sanitize HTML content.
     */
    public static function clean(?string $html): ?string
    {
        if (empty($html)) {
            return $html;
        }

        // Strip disallowed tags
        $cleaned = strip_tags($html, self::ALLOWED_TAGS);

        // Remove dangerous javascript: URIs
        $cleaned = preg_replace('/href\s*=\s*["\']\s*javascript:[^"\']*["\']/i', 'href="#"', $cleaned);

        // Remove dangerous on* attributes (onclick, onerror, onload, etc.)
        $cleaned = preg_replace('/\s*on\w+\s*=\s*["\'][^"\']*["\']/i', '', $cleaned);
        $cleaned = preg_replace('/\s*on\w+\s*=\s*[^"\'>\s]+/i', '', $cleaned);

        return $cleaned;
    }
}
