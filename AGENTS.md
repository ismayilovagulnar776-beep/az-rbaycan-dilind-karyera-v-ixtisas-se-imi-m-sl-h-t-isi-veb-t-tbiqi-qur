<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Practice-quiz feedback calls OpenRouter only from a server function (`src/lib/feedback.*`); the key lives in the `OPENROUTER_API_KEY` secret and the optional `OPENROUTER_MODEL` secret picks from an allowlist — keeps the key off the client and the model swappable without code.
- The server looks up the question and correct answer by id; the browser only sends the question id and chosen option — so students can't fake the correct answer in requests.
