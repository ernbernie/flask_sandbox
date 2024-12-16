## Feature Backlog

### Prefixed Text in Prayer Input Field
- **Objective**: Ensure "Dear Heavenly Father," is permanently affixed at the start of every prayer in the input field.
- **Approaches**:
  1. Use a `contenteditable` solution with a fixed span for the prefix.
  2. Use JavaScript to dynamically append and lock the prefix.
  3. Explore CSS-only solutions for immutable prefix styling.
- **Status**: To be implemented later.
- **Priority**: Medium

### API Response - Display Verse then gpt response.
- **Objective**: Make sure that the response starts off with the selected verse and writes it all out in its completion.
- **Approaches**:
    1. Use a database of verses and have chat gpt select a verse based on the prompt and then reply after knowing the prompt and verse selected.
    2. Specify chat gpt to first list out the verse in its entirety before responding.
- **Status**: To be implemented later
- **Priority**: Medium

### User Experience - Animations & Loading Bar
- **Objective**: Add animations and interactions for user experience
- **Approaches**:
    1. Add a loading bar when waiting for api response
    2. Smooth scrolling and mouse surfing
- **Status**: To be implemented later
- **Priority**: Medium