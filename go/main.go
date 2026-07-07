package main

import (
	"embed"
	"fmt"
	"html/template"
	"io/fs"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
)

//go:embed public
var publicFS embed.FS

var (
	baseURL   = getEnv("BASE_URL", "https://valkcryption.com")
	gitHubURL = getEnv("GITHUB_URL", "https://github.com/00011110/valkcryption")
	port      = getEnv("PORT", "8443")
	host      = getEnv("HOST", "127.0.0.1")
)

var pubKeyRe = regexp.MustCompile(`^[A-Za-z0-9_-]{40,48}$`)
var cipherRe = regexp.MustCompile(`^[A-Za-z0-9_-]{16,512}$`)

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	mux := http.NewServeMux()

	// Static files
	staticFS, _ := fs.Sub(publicFS, "public")
	mux.Handle("/css/", http.StripPrefix("/", http.FileServer(http.FS(staticFS))))
	mux.Handle("/js/", http.StripPrefix("/", http.FileServer(http.FS(staticFS))))
	mux.Handle("/ads.json", http.StripPrefix("/", http.FileServer(http.FS(staticFS))))

	// Main routes
	mux.HandleFunc("/", handleRoot)
	mux.HandleFunc("/p", handlePaste)
	mux.HandleFunc("/p/", handlePaste)
	mux.HandleFunc("/k/", handleKey)
	mux.HandleFunc("/keys", handleStaticPage("keys.html"))
	mux.HandleFunc("/privacy", handleStaticPage("privacy.html"))
	mux.HandleFunc("/contact", handleStaticPage("contact.html"))
	mux.HandleFunc("/old-links", handleStaticPage("old-links.html"))

	addr := fmt.Sprintf("%s:%s", host, port)
	log.Printf("Valkcryption (Go) listening on %s", addr)
	log.Printf("BASE_URL=%s", baseURL)
	log.Fatal(http.ListenAndServe(addr, mux))
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	renderPage(w, "compose.html", nil)
}

func handlePaste(w http.ResponseWriter, r *http.Request) {
	// Zeroize ?m= if present (same behavior as original)
	if m := r.URL.Query().Get("m"); m != "" {
		if !cipherRe.MatchString(m) {
			// still wipe it from memory (best effort in Go)
			r.URL.RawQuery = ""
		}
		r.URL.RawQuery = ""
	}
	renderPage(w, "paste.html", nil)
}

func handleKey(w http.ResponseWriter, r *http.Request) {
	key := strings.TrimPrefix(r.URL.Path, "/k/")
	if !pubKeyRe.MatchString(key) {
		http.NotFound(w, r)
		return
	}

	data := map[string]any{
		"PAGE_BOOT": template.JS(fmt.Sprintf(`{"publicKeyCompact":"%s"}`, key)),
	}
	renderPage(w, "key.html", data)
}

func handleStaticPage(filename string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		renderPage(w, filename, nil)
	}
}

// renderPage injects BASE_URL, GITHUB_URL and ad footer (same as original)
func renderPage(w http.ResponseWriter, name string, extra map[string]any) {
	tmplContent, err := publicFS.ReadFile("public/" + name)
	if err != nil {
		http.NotFound(w, nil)
		return
	}
	adFooterBytes, _ := publicFS.ReadFile("public/partials/ad-footer.html")
	adFooter := string(adFooterBytes)

	html := string(tmplContent)

	// Base replacements (add AD_FOOTER here)
	replacements := map[string]string{
		"{{BASE_URL}}":    baseURL,
		"{{GITHUB_URL}}":  gitHubURL,
		"{{AD_FOOTER}}":   adFooter,
	}
	for k, v := range replacements {
		html = strings.ReplaceAll(html, k, v)
	}

	// PAGE_BOOT (for /k/ pages)
	if extra != nil {
		if boot, ok := extra["PAGE_BOOT"]; ok {
			html = strings.ReplaceAll(html, "{{PAGE_BOOT}}", fmt.Sprintf("%v", boot))
		}
	}

	// Fallback ad injection (exact original behavior)
	if !strings.Contains(html, `id="ad-footer"`) {
		html = strings.Replace(html, "</body>", adFooter+"\n</body>", 1)
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(html))
}
